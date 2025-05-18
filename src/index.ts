#!/usr/bin/env a

import { program } from 'commander';
import inquirer from 'inquirer';
import * as path from 'path';
import { execSync } from 'child_process';
import { styleText } from 'node:util'
import os from 'node:os';
import { initialize, validateMenuFile } from './init';
import { MenuConfig } from './interfaces/menu-config';
import { MenuItem } from './interfaces/menu-item';

let histories: string[] = [];

const userDirectoryPath = path.join(os.homedir(), '.clinerd-launcher');
const menuFilePath = path.join(userDirectoryPath, 'menu.json');

let menu: MenuItem[] = [];

try {
    initialize();
    const menuConfig: MenuConfig = validateMenuFile(menuFilePath);
    menu = [
        {
            name: 'main',
            action: "category",
            children: menuConfig.menu,
        }
    ];
    
} catch (error) {
    const errorMessage = 'メニューファイルの読み込みに失敗しました。';
    console.log(styleText('red', errorMessage), error);

    process.exit(1);
}

/**
 * 指定したメニューから該当のメニュー項目を探して取得します
 * @param menuItems 選択肢となるメニューアイテム
 * @param names メニュー項目の名前を階層で指定します。例)  ['menu', 'talk', 'hello']
 * @returns
 */
function getMenuItem(menuItems: MenuItem[], names: string[]): MenuItem {
    let currentName: string | undefined = names.shift();
    if (currentName === undefined || currentName.length === 0) {
        throw new Error('メニュー名が空です');
    }
    
    for (const menuItem of menuItems) {
        if (
            menuItem.name === currentName
            || menuItem.alias === currentName
        ) {
            if (names.length === 0) {
                return menuItem;
            }

            if (menuItem.action === 'command') {
                return menuItem;
            }
            
            if (menuItem.action === 'category') {
                if (menuItem.children === undefined || menuItem.children.length === 0) {
                    throw new Error('メニューの子要素がありません');
                }

                return getMenuItem(menuItem.children, [...names]);
            }
        }
    }

    throw new Error(`メニューが見つかりません: ${currentName}`);
}

/**
 * メニューを表示
 */
function displayMenu() {
    let menuItem = getMenuItem(menu, [...histories]);

    if (menuItem.action === 'command') {
        // コマンドを実行
        execSync(menuItem.command as string, { stdio: 'inherit' });

        return;
    }

    if (menuItem.action === 'category') {
        // 選択肢を出す
        const choices: string[] = menuItem.children?.map(
            _menuItem => _menuItem.name,
        ) || [];

        inquirer.prompt([
            {
                type: 'list',
                name: 'selection',
                message: menuItem.memo || '選択してください',
                choices: choices,
            }
        ]).then(answers => {
            histories.push(answers.selection);
            displayMenu();
        });
    }
}

// commander を使用してCLIアプリケーションの設定
program
  .version('1.0.0')
  .description('A CLI application with nested menu');

// メインメニューの表示を開始
histories = ['main'];
displayMenu();
