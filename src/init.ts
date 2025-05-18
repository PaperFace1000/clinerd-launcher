import * as fs from 'fs';
import * as path from 'path';
import os from 'node:os';

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
