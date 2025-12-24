#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const distDir = path.resolve(process.cwd(), 'dist');

// 修复 chat-notification.d.ts 文件中缺失的导入
const notificationDtsPath = path.join(distDir, 'components', 'chat-notification.d.ts');

if (fs.existsSync(notificationDtsPath)) {
    let content = fs.readFileSync(notificationDtsPath, 'utf-8');

    // 检查是否已经有 getChatProvider 导入
    if (!content.includes('import { getChatProvider } from "../providers/chat-provider";')) {
        // 在导入语句部分添加 getChatProvider 导入
        content = content.replace(
            'import type { NotificationType } from "../types/x";',
            'import type { NotificationType } from "../types/x";\nimport { getChatProvider } from "../providers/chat-provider";'
        );

        fs.writeFileSync(notificationDtsPath, content);
        console.log('✅ 修复了 chat-notification.d.ts 中的 getChatProvider 导入');
    }
}

console.log('🎉 类型声明文件修复完成');
