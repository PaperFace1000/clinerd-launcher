import * as fs from 'fs';
import * as path from 'path';
import os from 'node:os';
import { MenuConfig } from './interfaces/menu-config';
import { MenuItem } from './interfaces/menu-item';

/**
 * メニューファイルが存在するか初期処理を実施
 */
export function initialize(): void {
    const userDirectoryPath = path.join(os.homedir(), '.clinerd-launcher');
    if (!fs.existsSync(userDirectoryPath)) {
        fs.mkdirSync(userDirectoryPath, { recursive: true });
    } else {
        const stats = fs.statSync(userDirectoryPath);
        if (!stats.isDirectory()) {
            console.error(`エラー: ${userDirectoryPath} ディレクトリが存在しません。`);
            process.exit(1);
        }
    }

    const menuFilePath = path.join(userDirectoryPath, 'menu.json');
    let existsMenuFile = false;
    if (fs.existsSync(menuFilePath)) {
        const stats = fs.statSync(menuFilePath);
        existsMenuFile = stats.isFile();
    }
    if (!existsMenuFile) {
        const sampleMenuFilePath = path.join(__dirname, 'assets', 'sample', 'menu.json');
        const destPath = path.join(userDirectoryPath, 'menu.json');
        fs.copyFileSync(sampleMenuFilePath, destPath);
    }
}

/**
 * メニューファイルの整合性チェック（バリデーション）
 * @param menuFilePath メニューファイルのパス
 * @returns バリデーションを通過したメニュー設定
 */
export function validateMenuFile(menuFilePath: string): MenuConfig {
    // TODO: メニューファイルが存在するか確認するロジックを入れる

    const menuFileContent = fs.readFileSync(menuFilePath, 'utf-8');
    let menuConfig: MenuConfig = JSON.parse(menuFileContent);
    if (!menuConfig.hasOwnProperty('menu')) {
        throw new Error('メニューファイルに "menu" プロパティが見つかりません');
    }

    let menu: MenuItem[] = menuConfig.menu;

    // フォーマットエラーをチェック
    for (const menuItem of menu) {
        let names: string[] = [];

        // 重複チェック
        let name: string = menuItem.name;
        if (names.some(str => str === name)) {
            throw new Error(`メニューの重複エラー: name: 「${name}」が重複しています`);
        }
        if (typeof name === 'string' && name.length === 0) {
            names.push(name);
        }

        let action: string = menuItem.action;
        if (!['command', 'category'].includes(action)) {
            throw new Error(`メニューのエラー: action: 「${action}」は無効な値です`);
        }

        if (action === 'command') {
            let command: string|null|undefined = menuItem.command;
            if (typeof command === 'undefined' || command === null || command.length === 0) {
                throw new Error(`メニューのエラー: action: 「command」の場合はcommandの指定が必要です`);
            }
        }

        if (action === 'category') {
            let childeren: MenuItem[]|null|undefined = menuItem.children;
            if (typeof childeren === 'undefined' || childeren === null || childeren.length === 0) {
                throw new Error(`メニューのエラー: action: 「category」の場合はchildrenの指定が必要です`);
            }
        }
    }

    return menuConfig;
}
