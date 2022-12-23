import inquirer from 'inquirer'

export async function selectList(title: string, data: { name: string, value: number | string }[]) {
  const { action } = await inquirer.prompt([
    {
      name: 'action',
      type: 'list',
      message: title,
      choices: data,
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