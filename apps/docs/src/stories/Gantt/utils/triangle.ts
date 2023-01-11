/**
 * 已知两直角边长，求斜边长
 * @param edge1 边长1
 * @param edge2 边长2
 */
export const getHypotenuseWidth = (edge1: number, edge2: number) => Math.sqrt(edge1 * edge1 + edge2 * edge2);