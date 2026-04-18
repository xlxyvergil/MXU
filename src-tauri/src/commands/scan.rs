//! 目录扫描模块
//!
//! 提供目录扫描和文件名过滤功能，用于 scan_select 选项

use std::path::{Path, PathBuf};

use super::utils::get_exe_directory;

/// 扫描目录下符合过滤器模式的文件
/// - `scan_dir`: 扫描目录（可以是绝对路径或相对于 exe 目录的相对路径）
/// - `scan_filter`: 文件名过滤器，支持通配符如 `*.json`，多个过滤器用 `;` 分隔
/// 返回匹配的文件名列表（不带路径前缀）
#[tauri::command]
pub fn scan_directory(scan_dir: String, scan_filter: String) -> Result<Vec<String>, String> {
    let exe_dir = get_exe_directory()?;
    let target_dir = if Path::new(&scan_dir).is_absolute() {
        PathBuf::from(&scan_dir)
    } else {
        exe_dir.join(&scan_dir)
    };

    if !target_dir.exists() || !target_dir.is_dir() {
        return Ok(Vec::new());
    }

    // 解析过滤器，支持 *.json 或 *.json;*.txt 格式
    let filters: Vec<&str> = scan_filter
        .split(';')
        .map(|s| s.trim())
        .filter(|s| !s.is_empty())
        .collect();

    let mut matched_files = Vec::new();
    let entries = std::fs::read_dir(&target_dir)
        .map_err(|e| format!("读取目录失败 [{}]: {}", target_dir.display(), e))?;

    for entry in entries.flatten() {
        let path = entry.path();
        if !path.is_file() {
            continue;
        }

        let Some(file_name) = path.file_name().and_then(|n| n.to_str()) else {
            continue;
        };

        // 检查是否匹配任一过滤器
        let matched = filters.iter().any(|pattern| match_file_pattern(file_name, pattern));

        if matched {
            matched_files.push(file_name.to_string());
        }
    }

    matched_files.sort();
    Ok(matched_files)
}

/// 检查文件名是否匹配通配符模式（如 *.json）
fn match_file_pattern(file_name: &str, pattern: &str) -> bool {
    if pattern == "*" {
        return true;
    }
    if !pattern.starts_with("*") {
        return file_name == pattern;
    }
    let suffix = &pattern[1..]; // 去掉开头的 *
    file_name.ends_with(suffix)
}
