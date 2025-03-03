import { Content } from '@/libs/models/content';
import { IContent, IContentCreateInput, IContentUpdateInput } from '@/libs/types/content';
import { InterestCategory, BoxContentType } from '@/libs/types/user';
import { FilterQuery } from 'mongoose';

export async function getAllContent(
  page: number = 1,
  limit: number = 10,
  search?: string,
  category?: InterestCategory,
  type?: BoxContentType,
  active?: boolean,
  featured?: boolean
): Promise<{ contents: IContent[]; total: number; pages: number }> {
  const query: FilterQuery<IContent> = {};
  
  if (search) {
    query.$text = { $search: search };
  }
  
  if (category) {
    query.category = category;
  }
  
  if (type) {
    query.type = type;
  }
  
  if (active !== undefined) {
    query.active = active;
  }

  if (featured !== undefined) {
    query.featured = featured;
  }

  const skip = (page - 1) * limit;
  
  const [contents, total] = await Promise.all([
    Content.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Content.countDocuments(query)
  ]);

  return {
    contents,
    total,
    pages: Math.ceil(total / limit)
  };
}

export async function getContentById(id: string): Promise<IContent | null> {
  return Content.findById(id);
}

export async function createContent(data: IContentCreateInput): Promise<IContent | null> {
  return Content.create(data);
}

export async function updateContent(
  id: string,
  data: IContentUpdateInput
): Promise<IContent | null> {
  return Content.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true }
  );
}

export async function deleteContent(id: string): Promise<boolean> {
  const result = await Content.deleteOne({ _id: id });
  return result.deletedCount === 1;
}

export async function toggleContentStatus(id: string): Promise<IContent | null> {
  const content = await Content.findById(id);
  if (!content) return null;

  content.active = !content.active;
  return content.save();
}

export async function getContentByCategory(
  category: InterestCategory,
  limit: number = 5,
  excludeIds: string[] = []
): Promise<IContent[]> {
  return Content.find({
    category,
    active: true,
    _id: { $nin: excludeIds }
  })
    .sort({ featured: -1, createdAt: -1 })
    .limit(limit);
}

export async function searchContent(
  query: string,
  limit: number = 10
): Promise<IContent[]> {
  return Content.find(
    { $text: { $search: query }, active: true },
    { score: { $meta: 'textScore' } }
  )
    .sort({ score: { $meta: 'textScore' } })
    .limit(limit);
} 