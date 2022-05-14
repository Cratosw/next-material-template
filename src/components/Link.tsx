import React from 'react';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import { Link as MuiLink,  LinkProps as MuiLinkProps } from '@mui/material';

interface NextLinkComposedProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'as'|'href'|'onMouseEnter'|"onClick">,NextLinkProps {
  to: NextLinkProps['href'];
  linkAs?: NextLinkProps['as'];
  href: NextLinkProps['href'];
}

const NextLinkComposed = React.forwardRef<HTMLAnchorElement, NextLinkComposedProps>(
  (props, ref) => {
    const {
      to,
      linkAs,
      href,
      replace,
      scroll,
      passHref,
      shallow,
      prefetch,
      locale,
      ...other
    } = props;
    return (
      <NextLink
        href={to}
        prefetch={prefetch}
        replace={replace}
        scroll={scroll}
        locale={locale}
        shallow={shallow}
        passHref={passHref}
        as={linkAs}
      >
        <a ref={ref} {...other} />
      </NextLink>
    );
  }
);
NextLinkComposed.displayName = 'NextLinkComposed';
export type LinkProps = {
  activeClassName?: string;
  as?: NextLinkProps['as'];
  href: NextLinkProps['href'];
  noLinkStyle?: boolean;
} & Omit<NextLinkComposedProps, 'to' | 'linkAs' | 'href'> &
  Omit<MuiLinkProps, 'href'>;

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(function Link(props, ref) {
  const {
    activeClassName = 'active',
    as: linkAsProp,
    className: classNameProps,
    href,
    noLinkStyle,
    role, // Link don't have roles.
    ...other
  } = props;

  const router = useRouter();
  const { locale, locales, defaultLocale } = router;
  const pathname = typeof href === 'string' ? href : href.pathname;
  const className = clsx(classNameProps, {
    [activeClassName]:!!pathname && router.pathname.includes(pathname)&& activeClassName
  });

  const isExternal =
    typeof href === 'string' && (href.indexOf('http') === 0 || href.indexOf('mailto:') === 0);

  if (isExternal) {
    if (noLinkStyle) {
      return <a className={className} href={href as string} ref={ref as any} {...other} />;
    }

    return <MuiLink className={className} href={href as string} ref={ref} {...other} />;
  }

  if (noLinkStyle) {
    return <NextLinkComposed className={className} ref={ref as any} to={href} {...other} href={href}/>;
  }

  //let linkAs = linkAsProp || (href as string);
  // if (typeof href === 'string') {
  //   linkAs = `${linkAs}`;
  // }

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
export default Link;
