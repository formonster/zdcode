export interface IButtonProps {
  /**
   * 按钮类型
   * @default default
   */
  type?: 'default' | 'primary' | 'cancel' | 'delete' | 'link'
  /**
   * 按钮大小
   * @default default
   */
  size?: 'large' | 'default' | 'small' 
  /**
   * 按钮内容
   * @type string
   * @default Click me!
   */
  children: string
  className?: string
  style?: React.CSSProperties
}