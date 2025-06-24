// src/components/CategoryList.jsx
import { Link } from 'react-router-dom';

const CategoryList = ({ categories }) => {
  return (
    <div className="category-list">
      {categories.map(category => (
        <Link
          key={category.id}
          to={`/todos-productos?categoria=${category.id}`}
          className="category-item"
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
};

export default CategoryList;