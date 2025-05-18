/**
 * メニュー項目のインターフェース
 */
export interface MenuItem {
    name: string;
    alias?: string | null;
    memo?: string;
    action: string;
    command?: string;
    children?: MenuItem[];
}
