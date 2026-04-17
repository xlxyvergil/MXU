import type { CaseItem } from './interface';

/**
 * scan_select 类型选项定义（动态扫描目录生成选项）
 */
export interface ScanSelectOption {
  type: 'scan_select';
  label?: string;
  description?: string;
  icon?: string;
  controller?: string[];
  resource?: string[];
  /** 扫描目录路径，支持 {PROJECT_DIR} 占位符 */
  scan_dir: string;
  /** 文件过滤模式，支持 glob 语法 */
  scan_filter: string;
  cases: CaseItem[];
  default_case?: string;
}
