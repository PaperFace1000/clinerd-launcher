/**
 * メニュー項目のインターフェース
 */
export interface MenuItem {
    name: string;
    memo?: string;
    action: string;
    command?: string;
    children?: MenuItem[];
}
