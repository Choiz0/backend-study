export interface IList{
    text: string;
    checked: boolean;
    id: number;
    __typename?: string;
}

export interface ALLTodosCache { 
    allTodos: IList[];
}