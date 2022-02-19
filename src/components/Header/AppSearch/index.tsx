import * as React from 'react';
import { styled, useTheme,useMediaQuery,Input } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const StyledInput = styled(Input)(({ theme }) => {
  const placeholder = {
    color: theme.palette.mode === 'dark' ? 'white' : 'black',
  };
  return {
    color: 'inherit',
    '& input': {
      padding: theme.spacing(1),
      paddingLeft: theme.spacing(3),
      fontSzie: '1rem',
      transition: theme.transitions.create('width'),
      width: 150,
      '&:focus': {
        width: 170,
      },
      '&::-webkit-input-placeholder': placeholder,
      '&::-moz-placeholder': placeholder, // Firefox 19+
      '&:-ms-input-placeholder': placeholder, // IE11
      '&::-ms-input-placeholder': placeholder, // Edge
    },
  };
});

const RootDiv = styled('div')(({ theme }) => {
  return {
    maxHeight:43,
    minHeight:43,
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.up('sm')]: {
      display: 'flex',
    },
    fontFamily: theme.typography.fontFamily,
    position: 'relative',
    backgroundColor:
      theme.palette.mode === 'dark' ? theme.palette.primaryDark[800] : theme.palette.grey[50],
    '&:hover': {
      backgroundColor:
        theme.palette.mode === 'dark' ? theme.palette.primaryDark[700] : theme.palette.grey[100],
    },
    color: theme.palette.mode === 'dark' ? 'white' : theme.palette.grey[900],
    border: `1px solid ${
      theme.palette.mode === 'dark' ? theme.palette.primaryDark[600] : theme.palette.grey[200]
    }`,
    borderRadius: 8,
  };
});

const SearchDiv = styled('div')(({ theme }) => {
  return {
    width: theme.spacing(3),
    
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.grey[700],
  };
});

const Shortcut = styled('div')<{styleprops:{isFocused:boolean}}>(({ theme,styleprops }) => {
  return {
    fontSize: theme.typography.pxToRem(13),
    fontWeight: 600,
    color: theme.palette.mode === 'dark' ? theme.palette.grey[200] : theme.palette.grey[700],
    lineHeight: '16px',
    border: `1px solid ${
      theme.palette.mode === 'dark' ? theme.palette.primaryDark[400] : theme.palette.grey[200]
    }`,
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.primaryDark[700] : '#FFF',
    padding: theme.spacing(0, 1),
    position: 'absolute',
    right: theme.spacing(1),
    height: 20,
    top: 'calc(50% - 11px)',
    borderRadius: 5,
    transition: theme.transitions.create('opacity', {
      duration: theme.transitions.duration.shortest,
    }),
    pointerEvents: 'none',
    ...(styleprops.isFocused &&{
        '&.Mui-focused': {
            opacity: 0,
          },
    }),
  };
});

export default function AppSearch() {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [focused, setFocused] = React.useState(false);
  const [isMacOS, setIsMacOS] = React.useState(false);
  const theme = useTheme();

  React.useEffect(() => {
    const handleKeyDown = (nativeEvent:KeyboardEvent) => {
      if (nativeEvent.defaultPrevented) {
        return;
      }

      if (nativeEvent.key === 'Escape' && document.activeElement === inputRef.current) {
        inputRef.current?.blur();
        return;
      }

      const matchMainShortcut =
        (nativeEvent.ctrlKey || nativeEvent.metaKey) && nativeEvent.key === 'k';
      const matchNonkeyboardNode =
      document.activeElement && ['INPUT', 'SELECT', 'TEXTAREA'].indexOf(document.activeElement!.tagName) === -1 &&
        !(document.activeElement! as any).isContentEditable;

      if (matchMainShortcut && matchNonkeyboardNode) {
        nativeEvent.preventDefault();
        inputRef.current?.focus();
      }
    };
    const macOS = window.navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    setIsMacOS(macOS);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const desktop = useMediaQuery(theme.breakpoints.up('sm'));


  

  return (
    <RootDiv>
      <SearchDiv>
        <SearchIcon
          fontSize="small"
          sx={{
            width: '40px',
            color:
              theme.palette.mode === 'dark' ? theme.palette.grey[500] : theme.palette.primary[500],
          }}
        />
      </SearchDiv>
      <StyledInput
        disableUnderline
        placeholder={`请输入关键字…`}
        inputProps={{
          'aria-label': "请输入关键字",
        }}
        type="search"
        id="docsearch-input"
        inputRef={inputRef}
        onFocus={() => {
          setFocused(true);
        }}
        onBlur={() => {
          setFocused(false);
        }}
      />
      <Shortcut styleprops={{isFocused:focused}}>
        {isMacOS ? '⌘' : 'Ctrl+'}K
      </Shortcut>
    </RootDiv>
  );
}
