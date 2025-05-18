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

let history: string[] = [];

const userDirectoryPath = path.join(os.homedir(), '.clinerd-launcher');
const menuFilePath = path.join(userDirectoryPath, 'menu.json');

let menu: MenuItem[] = [];
try {
    initialize();

    const menuConfig: MenuConfig = validateMenuFile(menuFilePath);

} catch (error) {
    const errorMessage = 'メニューファイルの読み込みに失敗しました。';
    console.log(styleText('red', errorMessage), error);

    process.exit(1);
}

// commander を使用してCLIアプリケーションの設定
program
  .version('0.0.1')
  .description('A CLI application with nested menu');

// オプションの定義（ここでは使用していませんが、commander の基本的な使い方を示すため残しています）
program.parse(process.argv);

// メインメニューの表示を開始
// displayMenu('main');
