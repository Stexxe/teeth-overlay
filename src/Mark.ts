import {equal, Point} from "./Point";

export type Mark = Point;

export const findMark = (marks: Mark[], mark: Mark): [boolean, number] => {
    const index = marks.findIndex((m) => equal(m, mark));
    return [index !== -1, index];
};
