import { ClearFiltersButton } from '@/components/common/ClearFiltersButton';
import { SearchInput } from '@/components/common/SearchInput';
import { Select } from '@/components/common/Select';
import { FOOD_SORT_OPTIONS } from '@/utils/constants';
import { idFilterError, toIdFilter } from '@/utils/validationUtils';

const STOCK_OPTIONS = [
  { value: 'true', label: 'In stock' },
  { value: 'false', label: 'Sold out' },
];

/**
 * The food list's filters and order. The name search sits in the page's hero and the listing in the quick filters
 * above (FoodListingFilters).
 */
export function FoodFilterBar({ filters, categories, onChange, onClear }) {
  const categoryOptions = categories.map((category) => ({
    value: String(category.id),
    label: category.name,
  }));

  return (
    <div className="grid items-start gap-3 sm:grid-cols-2 lg:grid-cols-[repeat(4,minmax(0,1fr))_auto]">
      <SearchInput
        label="Restaurant #"
        placeholder="Restaurant id"
        inputMode="numeric"
        value={filters.restaurantId?.toString() ?? ''}
        validate={idFilterError}
        onSearch={(text) => onChange({ restaurantId: toIdFilter(text) })}
      />
      <Select
        label="Category"
        placeholder="All categories"
        options={categoryOptions}
        value={filters.categoryId?.toString() ?? ''}
        onChange={(event) => onChange({ categoryId: toIdFilter(event.target.value) })}
      />
      <Select
        label="Stock"
        placeholder="Any stock"
        options={STOCK_OPTIONS}
        value={filters.available === undefined ? '' : String(filters.available)}
        onChange={(event) =>
          onChange({
            available: event.target.value === '' ? undefined : event.target.value === 'true',
          })
        }
      />
      <Select
        label="Sort by"
        options={FOOD_SORT_OPTIONS}
        value={filters.sort}
        onChange={(event) => onChange({ sort: event.target.value })}
      />
      <div className="flex items-end sm:pt-7">
        <ClearFiltersButton onClick={onClear} />
      </div>
    </div>
  );
}
