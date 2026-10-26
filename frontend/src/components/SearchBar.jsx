import { forwardRef } from 'react';
import { CloseIcon, SearchIcon } from './Icons.jsx';
import styles from './SearchBar.module.css';

const SearchBar = forwardRef(function SearchBar({ value, onChange }, ref) {
  return (
    <div className={styles.box}>
      <SearchIcon size={16} />
      <input
        ref={ref}
        type="search"
        className={styles.input}
        value={value}
        placeholder="Buscar tarefas"
        aria-label="Buscar tarefas"
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button type="button" className={styles.clear} onClick={() => onChange('')} aria-label="Limpar busca">
          <CloseIcon size={14} />
        </button>
      )}
    </div>
  );
});

export default SearchBar;
