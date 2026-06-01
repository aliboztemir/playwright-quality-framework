import { BaseRepository } from '../../../framework/core/BaseRepository';
import type { ProductTestData } from '../models/ProductTestData';
import type { Pool } from 'pg';

type ProductRow = {
  id:             number;
  name:           string;
  list_price:     string;
  type:           'consu' | 'service' | 'combo';
  invoice_policy: 'order' | 'delivery';
  variant_count:  string;
  category_name:  string | null;
};

export class ProductRepository extends BaseRepository {
  constructor(pool: Pool) {
    super(pool);
  }

  async findPublishedForUiTesting(): Promise<ProductTestData[]> {
    const result = await this.pool.query<ProductRow>(`
      SELECT
        pt.id,
        pt.name->>'en_US'                  AS name,
        pt.list_price,
        pt.type,
        pt.invoice_policy,
        COUNT(DISTINCT pp.id)              AS variant_count,
        pc.name->>'en_US'                  AS category_name
      FROM product_template pt
      LEFT JOIN product_product pp
        ON pp.product_tmpl_id = pt.id AND pp.active = true
      LEFT JOIN product_public_category_product_template_rel rel
        ON rel.product_template_id = pt.id
      LEFT JOIN product_public_category pc
        ON pc.id = rel.product_public_category_id
      WHERE pt.sale_ok     = true
        AND pt.active      = true
        AND pt.is_published = true
      GROUP BY pt.id, pt.name, pt.list_price, pt.type, pt.invoice_policy, pc.name
      ORDER BY pt.id
    `);

    return result.rows.map((row): ProductTestData => ({
      id:            row.id,
      name:          row.name,
      price:         parseFloat(row.list_price),
      type:          row.type,
      invoicePolicy: row.invoice_policy,
      variantCount:  parseInt(row.variant_count, 10),
      categoryName:  row.category_name ?? null,
    }));
  }
}
