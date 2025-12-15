import { useState } from 'react';
import { TextField, Button, Stack, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface FacturasSearchBarProps {
  onSearch?: (searchTerm: string) => void;
}

export default function FacturasSearchBar({ onSearch }: FacturasSearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Stack direction="row" spacing={2}>
      <TextField
        fullWidth
        placeholder="Buscar por folio"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyPress={handleKeyPress}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            backgroundColor: 'background.paper',
          },
        }}
      />
      <Button
        variant="contained"
        size="large"
        onClick={handleSearch}
        sx={{
          minWidth: 120,
          borderRadius: 2,
          textTransform: 'none',
          fontWeight: 600,
        }}
      >
        Buscar
      </Button>
    </Stack>
  );
}
