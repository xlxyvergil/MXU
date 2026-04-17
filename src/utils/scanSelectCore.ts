/**
 * 处理 scan_select 的 pipeline_override，替换占位符为选中值
 * @param pipelineOverride 原始 pipeline_override 对象
 * @param optionKey 选项键名
 * @param selectedValue 选中的 case 名称
 * @returns 处理后的 pipeline_override 对象
 */
export function processScanSelectPipeline(
  pipelineOverride: Record<string, unknown>,
  optionKey: string,
  selectedValue: string,
): Record<string, unknown> {
  const cloned = JSON.parse(JSON.stringify(pipelineOverride));
  const str = JSON.stringify(cloned);
  
  // 转义特殊字符，构建正则表达式
  const escapedKey = optionKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const replaced = str.replace(new RegExp(`\\{${escapedKey}\\}`, 'g'), selectedValue);
  
  return JSON.parse(replaced);
}
