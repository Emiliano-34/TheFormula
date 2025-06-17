const CategoryList = ({ categories }) => {
  return (
    <div className="category-list">
      {categories.map(category => (
        <a 
          key={category.id} 
          href={`/category/${category.name.toLowerCase()}`} 
          className="category-item"
        >
          {category.name}
        </a>
      ))}
    </div>
  );
};

export default CategoryList;