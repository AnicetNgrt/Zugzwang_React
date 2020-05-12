export type Vec2 = {
    x:number,
    y:number
}

export function add(vec1: Vec2, vec2: Vec2):Vec2 {
    return { x: vec1.x + vec2.x, y: vec1.y + vec2.y };
}