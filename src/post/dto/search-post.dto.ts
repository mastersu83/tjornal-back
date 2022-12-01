export class SearchPostDto {
  title?: string;
  shortDesc?: string;
  longDesc?: string;
  views?: 'DESC' | 'ASC';
  limit?: number;
  take?: number;
  tag?: string;
}
