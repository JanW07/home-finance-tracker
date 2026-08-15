export interface CategoryResponseDTO {
  id: number;
  name: string;
  icon?: string;
}

export interface CategoryRequestDTO {
  name: string;
  icon?: string;
}