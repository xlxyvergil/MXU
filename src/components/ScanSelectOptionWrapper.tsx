import { useTranslation } from 'react-i18next';
import type { ScanSelectOption } from '@/types/scanSelect';
import type { OptionValue } from '@/types/interface';
import { ScanSelectOptionComponent as CoreScanSelectComponent } from './ScanSelectOption';
import { OptionLabelWithIncompatible, OptionDescription } from './OptionEditor';
import clsx from 'clsx';

interface ScanSelectOptionWrapperProps {
  optionDef: ScanSelectOption;
  optionKey: string;
  value: OptionValue | undefined;
  onChange: (value: OptionValue) => void;
  basePath: string;
  disabled?: boolean;
  depth?: number;
  incompatibleReason?: string;
  translations?: Record<string, string>;
}

/**
 * scan_select 选项包装器（包含完整布局和标签）
 */
export function ScanSelectOptionWrapper({
  optionDef,
  optionKey,
  value,
  onChange,
  basePath,
  disabled,
  depth = 0,
  incompatibleReason,
  translations,
}: ScanSelectOptionWrapperProps) {
  // 解析标签和描述
  const optionLabel = optionDef.label || optionKey;
  const optionDescription = optionDef.description;

  return (
    <div
      className={clsx(
        'space-y-3',
        depth > 0 && 'ml-4 pl-3 border-l-2 border-border',
        incompatibleReason && 'opacity-60',
      )}
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1 max-w-[60%]">
          <OptionLabelWithIncompatible
            label={optionLabel}
            icon={optionDef.icon}
            basePath={basePath}
            incompatibleReason={incompatibleReason}
          />
          <OptionDescription
            description={optionDescription}
            basePath={basePath}
            translations={translations}
          />
        </div>
        <CoreScanSelectComponent
          optionDef={optionDef}
          value={value as { type: 'scan_select'; caseName: string }}
          onChange={(caseName) => {
            if (!disabled) {
              onChange({ type: 'scan_select', caseName });
            }
          }}
          basePath={basePath}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
