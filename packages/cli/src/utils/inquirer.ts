import inquirer from 'inquirer'

export async function selectList(title: string, data: ({ name: string, value: number | string } | string)[]) {
  const { action } = await inquirer.prompt([
    {
      name: 'action',
      type: 'list',
      message: title,
      choices: data.map((item) => {
        if (typeof item === 'string') return { name: item, value: item }
        return item
      }),
    },
  ])

  return action
}

export const input = async (title: string) => {
  const { action } = await inquirer.prompt([
    {
      name: 'action',
      type: 'input',
      message: title,
    },
  ])

  return action
}

export const confirm = async (title: string, defaultValue?: boolean) => {
  const { action } = await inquirer.prompt([
    {
      name: 'action',
      type: 'confirm',
      message: title,
      default: defaultValue
    },
  ])

  return action
}