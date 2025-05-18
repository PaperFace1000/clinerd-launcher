#!/usr/bin/env a

import { program } from 'commander';
import inquirer from 'inquirer';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { styleText } from 'node:util'
import os from 'node:os';

interface MenuConfig {
    menu: MenuItem[];
}

interface MenuItem {
    name: string;
    alias?: string | null;
    memo?: string;
    action: string;
    command?: string;
    children?: MenuItem[];
}

let history: string[] = [];

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
// TODO: メニュー定義ファイルが存在しない場合はサンプルのメニューファイルを作成するようにしたい
if (fs.existsSync(menuFilePath)) {
    const stats = fs.statSync(menuFilePath);
    existsMenuFile = stats.isFile();
}
if (!existsMenuFile) {
    // TODO: いきなりファイルを作成してしまっているが、作成するかどうかをユーザーと対話して決めるようにしたい。
    const sampleMenuFilePath = path.join(__dirname, 'assets', 'sample', 'menu.json');
    const destPath = path.join(userDirectoryPath, 'menu.json');
    fs.copyFileSync(sampleMenuFilePath, destPath);
    
    // TODO: 作成しないを選択した場合はこのエラーを出す予定。
    // console.log(`エラー: メニューファイルが存在しません。${menuFilePath}を作成してください。`);
}

let menu: MenuItem[] = [];
try {
    const menuFileContent = fs.readFileSync(menuFilePath, 'utf-8');
    let menuConfig: MenuConfig = JSON.parse(menuFileContent);
    if (!menuConfig.hasOwnProperty('menu')) {
        throw new Error('メニューファイルに "menu" プロパティが見つかりません');
    }

    menu = menuConfig.menu;

    // フォーマットエラーをチェック
    for (const menuItem of menu) {
        let names: string[] = [];
        let aliases: string[] = [];

        // 重複チェック
        let name: string = menuItem.name;
        if (names.some(str => str === name)) {
            throw new Error(`メニューの重複エラー: name: 「${name}」が重複しています`);
        }
        if (typeof name === 'string' && name.length === 0) {
            names.push(name);
        }

        let alias: string|null|undefined = menuItem.alias;
        if (aliases.some(str => str === alias)) {
            throw new Error(`メニューの重複エラー: alias: 「${alias}」が重複しています`);
        }
        if (typeof alias === 'string' && alias.length > 0) {
            aliases.push(alias);
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
