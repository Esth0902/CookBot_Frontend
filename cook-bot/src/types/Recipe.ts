export interface IngredientDto {
    name: string;
    quantity: number;
    unit: string;
}

export interface StepDto {
    stepNumber: number;
    description: string;
}

export interface TipDto {
    tips: string[];
}

export interface Recipe {
    name: string;
    durationMinutes: number;
    ingredients: IngredientDto[];
    steps: StepDto[];
    tips: TipDto[];
}
