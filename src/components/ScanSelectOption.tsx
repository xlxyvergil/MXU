import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { ScanSelectOption } from '@/types/scanSelect';
import { RefreshCw } from 'lucide-react';
import clsx from 'clsx';

// TODO: 后续需要实现 Tauri command 来扫描目录
async function scanDirectory(scanDir: string, scanFilter: string): Promise<string[]> {
  // 临时实现：返回空数组，等待后端实现
  console.log('Scan directory:', scanDir, 'Filter:', scanFilter);
  return [];
}

interface ScanSelectOptionProps {
  optionDef: ScanSelectOption;
  value: { type: 'scan_select'; caseName: string };
  onChange: (caseName: string) => void;
  basePath: string;
  disabled?: boolean;
}

/**
 * scan_select 类型选项组件（带刷新按钮的下拉框）
 */
export function ScanSelectOptionComponent({
  optionDef,
  value,
  onChange,
  basePath,
  disabled,
}: ScanSelectOptionProps) {
  const { t } = useTranslation();
  const [cases, setCases] = useState<Array<{ name: string; label: string }>>([]);
  const [loading, setLoading] = useState(false);

  const loadCases = async () => {
    setLoading(true);
    try {
      const scanPath = optionDef.scan_dir.replace('{PROJECT_DIR}', basePath);
      const files = await scanDirectory(scanPath, optionDef.scan_filter);
      
      const newCases = files.map(file => ({
        name: file,
        label: file,
      }));
      
      setCases(newCases);
      
      // 如果当前选中的值不在新列表中，重置为第一个
      if (newCases.length > 0 && !newCases.some(c => c.name === value.caseName)) {
        onChange(newCases[0].name);
      }
    } catch (error) {
      console.error('Failed to scan directory:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCases();
  }, [optionDef.scan_dir, optionDef.scan_filter]);

  return (
    <div className="flex items-center gap-2">
      <select
        value={value.caseName}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled || loading}
        className={clsx(
          'flex-1 px-3 py-2 rounded border border-border bg-bg-primary text-text-primary',
          'focus:outline-none focus:ring-2 focus:ring-accent/50',
          disabled && 'opacity-60 cursor-not-allowed',
        )}
      >
        {cases.length === 0 ? (
          <option value="">{t('optionEditor.noOptions')}</option>
        ) : (
          cases.map((c) => (
            <option key={c.name} value={c.name}>
              {t(c.label) || c.name}
            </option>
          ))
        )}
      </select>
      <button
        onClick={loadCases}
        disabled={disabled || loading}
        className={clsx(
          'p-2 rounded hover:bg-bg-hover transition-colors',
          disabled && 'opacity-60 cursor-not-allowed',
        )}
        title={t('optionEditor.refresh')}
      >
        <RefreshCw className={clsx('w-4 h-4', loading && 'animate-spin')} />
      </button>
    </div>
  );
}
