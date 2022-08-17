import React from 'react';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import { Link as MuiLink, LinkProps as MuiLinkProps, styled } from '@mui/material';
import { motion } from 'framer-motion';

const Anchor = styled(motion.a)({});

interface NextLinkComposedProps
  extends Omit<React.LegacyRef<HTMLAnchorElement>, 'as' | 'href' | 'onMouseEnter' | 'onClick'>,
    Omit<NextLinkProps, 'href' | 'as'> {
  to: NextLinkProps['href'];
  linkAs?: NextLinkProps['as'];
  href: NextLinkProps['href'];
}

const NextLinkComposed = React.forwardRef<HTMLAnchorElement, NextLinkComposedProps>(
  (props, ref) => {
    const { to, linkAs, href, replace, scroll, passHref, shallow, prefetch, locale, ...other } =
      props;
    return (
      <NextLink
        href={to}
        prefetch={prefetch}
        as={linkAs}
        replace={replace}
        scroll={scroll}
        locale={locale}
        shallow={shallow}
        passHref={passHref}
      >
        <Anchor ref={ref} {...other} />
      </NextLink>
    );
  }
);
NextLinkComposed.displayName = 'NextLinkComposed';
export type LinkProps = {
  activeClassName?: string;
  as?: NextLinkProps['as'];
  href: NextLinkProps['href'];
} & Omit<NextLinkComposedProps, 'to' | 'linkAs' | 'href'> &
  Omit<MuiLinkProps, 'href'>;

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(function Link(props, ref) {
  const {
    activeClassName = 'active',
    as: linkAsProp,
    className: classNameProps,
    href,
    role, // Link don't have roles.
    ...other
  } = props;

  const router = useRouter();
  const { locale, locales, defaultLocale } = router;
  const pathname = typeof href === 'string' ? href : href?.pathname;
  const className = clsx(classNameProps, {
    [activeClassName]: !!pathname && router.pathname.includes(pathname) && activeClassName
  });

  const isExternal =
    typeof href === 'string' && (href.indexOf('http') === 0 || href.indexOf('mailto:') === 0);

  if (isExternal) {
    return <MuiLink className={className} href={href as string} ref={ref} {...other} />;
  }
  return (
    <MuiLink
      component={NextLinkComposed}
      linkAs={linkAsProp || (href as string)}
      className={className}
      locale={locale}
      ref={ref}
      to={href}
      {...other}
    />
  );
});
Link.displayName = 'Link';
export default Link;
