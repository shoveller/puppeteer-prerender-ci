#!/usr/bin/env zx

import { $, chalk } from 'zx';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Chrome 설정을 위한 스크립트
 * 1. 분할된 Chrome 압축 파일 결합
 * 2. 결합된 zip 파일 압축 해제
 * 3. Chrome 실행 파일에 실행 권한 부여
 */
async function prepareChrome() {
  try {
    console.log(chalk.blue('Chrome 설정 시작...'));
    
    // 1. 분할된 Chrome 압축 파일 결합
    console.log(chalk.yellow('1. 분할된 Chrome 압축 파일 결합 중...'));
    await $`cat ./chrome/chrome-linux.zip.part-* > chrome-linux.zip`;
    console.log(chalk.green('✓ Chrome 압축 파일 결합 완료'));
    
    // 2. 결합된 zip 파일 압축 해제
    console.log(chalk.yellow('2. Chrome zip 파일 압축 해제 중...'));
    await $`unzip chrome-linux.zip`;
    console.log(chalk.green('✓ Chrome zip 파일 압축 해제 완료'));
    
    // chrome-linux 디렉토리가 존재하는지 확인
    const chromeDirExists = fs.existsSync(path.resolve('./chrome-linux'));
    if (!chromeDirExists) {
      throw new Error('chrome-linux 디렉토리를 찾을 수 없습니다.');
    }
    
    // 디렉토리 내용 확인
    const dirContents = await $`ls -la chrome-linux/`;
    console.log(dirContents.stdout);
    
    // 3. Chrome 실행 파일에 실행 권한 부여
    console.log(chalk.yellow('3. Chrome 실행 파일에 실행 권한 부여 중...'));
    await $`chmod +x ./chrome-linux/chrome`;
    await $`chmod +x ./chrome-linux/chrome_sandbox`;
    await $`chmod +x ./chrome-linux/chrome-wrapper`;
    console.log(chalk.green('✓ Chrome 실행 파일에 실행 권한 부여 완료'));
    
    console.log(chalk.blue('Chrome 설정 완료!'));
  } catch (error) {
    console.error(chalk.red('Chrome 설정 중 오류 발생:'), error);
    process.exit(1);
  }
}

// 스크립트 실행
prepareChrome();