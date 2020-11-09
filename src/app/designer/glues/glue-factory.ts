import { Glue } from 'src/app/glue';
import { Designer } from '../designer';

export type GlueFactory<T> = (
  designer: Designer,
  opts?: T,
) => Glue | Glue[];
