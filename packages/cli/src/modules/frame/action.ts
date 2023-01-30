import { Frame } from "./type";
import { selectList } from "../../utils/inquirer"

export const createProject = async (root: string, projectName: string, frame: Frame) => {
  const cwd = process.cwd()
  const projectPath = `${root}/${projectName}`

  console.log('')
  console.log('🐳', chalk.gray('您的项目路径为:'), chalk.yellow(projectPath))
  console.log('')
  
  await cd(root)
  await $`git clone -b ${frame.branch} ${frame.git_url} ${projectName}`
  await $`rm -rf ${projectPath}/.git`
  
  // 是否需要初始化 git
  if (frame.whether_init_git) {
    await $`git init`
    await $`git add .`
    await $`git commit -m first commit`
    await $`git branch -M main`
  }
  await cd(cwd)
}

export async function initDependency(projectPath: string) {
  const cwd = process.cwd()
  const action = await selectList('请你选择包管理工具:', ['pnpm', 'yarn', 'npm'])
  await cd(projectPath)
  await $`pwd`
  try {
    await $`${action} install`
  } catch (p: any) {
    // 初始化 turbo app 时会当作异常终止，这里捕获一下，继续往下执行
    // console.log(`Exit code: ${p.exitCode}`)
    // console.log(`Error: ${p.stderr}`)
  }
  await cd(cwd)

  console.log(
    '\n🐳',
    chalk.yellowBright(projectPath),
    chalk.green(`初始化完成`)
  )

  console.log('\n🐳', chalk.yellowBright('$'), chalk.gray(`cd ${projectPath}`))
  console.log(
    '🐳',
    chalk.yellowBright('$'),
    chalk.gray('yarn dev')
  )
  console.log()
}