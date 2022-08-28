import * as React from 'react';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import { styled, alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Link from 'src/components/Link';
import { MotionDivBox } from 'src/components/MotionBox';

interface DashboardMenuProps {
  handleLeftRightArrow: (
    event: React.KeyboardEvent,
    element: EventTarget | HTMLElement | null | undefined
  ) => void;
}
const PRODUCT_IDS = ['product-core', 'product-advanced', 'product-templates', 'product-design'];
const Img = styled('img')({ display: 'inline-block', verticalAlign: 'bottom' });
type HeaderSubMenuProps = {
  icon: React.ReactElement;
  name: React.ReactNode;
  description: React.ReactNode;
  href: string;
} & Omit<JSX.IntrinsicElements['a'], 'ref'>;

const HeaderSubMenu = React.forwardRef<HTMLAnchorElement, HeaderSubMenuProps>(
  function HeaderSubMenu({ icon, name, description, href, ...props }, ref) {
    return (
      <Box
        component={Link}
        href={href}
        ref={ref}
        sx={{
          display: 'flex',
          alignItems: 'center',
          py: 1,
          '&:hover, &:focus': {
            backgroundColor: theme =>
              theme.palette.mode === 'dark' ? 'primaryDark.700' : 'grey.50',
            outline: 'none',
            '@media (hover: none)': {
              backgroundColor: 'initial',
              outline: 'initial'
            }
          }
        }}
        {...props}
      >
        <MotionDivBox
          sx={{
            px: 2,
            '& circle': {
              fill: theme =>
                theme.palette.mode === 'dark'
                  ? theme.palette.primaryDark[700]
                  : theme.palette.grey[100]
            }
          }}
        >
          {icon}
        </MotionDivBox>
        <div>
          <Typography color="text.primary" variant="body2" fontWeight={700}>
            {name}
          </Typography>
          <Typography color="text.secondary" variant="body2">
            {description}
          </Typography>
        </div>
      </Box>
    );
  }
);

const DashboardMenu: React.FC<DashboardMenuProps> = ({ handleLeftRightArrow }) => {
  const menuRef = React.useRef<HTMLAnchorElement | null>(null);
  const [subMenuOpen, setSubMenuOpen] = React.useState(false);
  const [subMenuIndex, setSubMenuIndex] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (typeof subMenuIndex === 'number') {
      document.getElementById(PRODUCT_IDS[subMenuIndex])?.focus();
    }
  }, [subMenuIndex]);
  function onhandleKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Tab' && !event.shiftKey) {
      event.preventDefault();
      handleLeftRightArrow(
        new KeyboardEvent('keydown', { key: 'ArrowRight' }) as unknown as React.KeyboardEvent,
        menuRef.current?.parentElement
      );
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      handleLeftRightArrow(event, menuRef.current?.parentElement);
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (event.target === menuRef.current) {
        setSubMenuOpen(true);
      }
      setSubMenuIndex(prevValue => {
        if (prevValue === null) {
          return 0;
        }
        if (prevValue === PRODUCT_IDS.length - 1) {
          return 0;
        }
        return prevValue + 1;
      });
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setSubMenuIndex(prevValue => {
        if (prevValue === null) {
          return 0;
        }
        if (prevValue === 0) {
          return PRODUCT_IDS.length - 1;
        }
        return prevValue - 1;
      });
    }
    if (event.key === 'Escape') {
      setSubMenuOpen(false);
      setSubMenuIndex(null);
    }
  }
  return (
    <li
      role="none"
      onMouseOver={() => setSubMenuOpen(true)}
      onFocus={() => setSubMenuOpen(true)}
      onMouseOut={() => setSubMenuOpen(false)}
      onBlur={() => setSubMenuOpen(false)}
    >
      <Link
        role="menuitem"
        tabIndex={0}
        id="products-menu"
        aria-expanded={subMenuOpen ? 'true' : 'false'}
        onKeyDown={event => {
          onhandleKeyDown(event);
        }}
        ref={menuRef}
        href="/dashboards"
      >
        数据展示
      </Link>
      <Popper
        open={subMenuOpen}
        anchorEl={menuRef.current}
        transition
        placement="bottom-start"
        style={{ zIndex: 1200 }}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper
              variant="outlined"
              sx={{
                minWidth: 200,
                overflow: 'hidden',
                borderColor: theme =>
                  theme.palette.mode === 'dark' ? 'primaryDark.700' : 'grey.200',
                bgcolor: theme =>
                  theme.palette.mode === 'dark' ? 'primaryDark.900' : 'background.paper',
                boxShadow: theme =>
                  `0px 4px 20px ${
                    theme.palette.mode === 'dark'
                      ? alpha(theme.palette.background.paper, 0.72)
                      : 'rgba(170, 180, 190, 0.3)'
                  }`,
                '& ul': {
                  margin: 0,
                  padding: 0,
                  listStyle: 'none'
                },
                '& li:not(:last-of-type)': {
                  borderBottom: '1px solid',
                  borderColor: theme =>
                    theme.palette.mode === 'dark' ? 'primaryDark.700' : 'grey.100'
                },
                '& a': { textDecoration: 'none' }
              }}
            >
              <ul role="menu">
                <li role="none">
                  <HeaderSubMenu
                    id={PRODUCT_IDS[0]}
                    role="menuitem"
                    href="/dashboards/fileManager"
                    icon={
                      <Img
                        src="/static/images/avatars/1.webp"
                        alt=""
                        loading="lazy"
                        width={18}
                        height={18}
                      />
                    }
                    name="文件管理"
                    description=""
                    onKeyDown={event => {
                      onhandleKeyDown(event);
                    }}
                  />
                </li>
              </ul>
            </Paper>
          </Fade>
        )}
      </Popper>
    </li>
  );
};
export default DashboardMenu;
