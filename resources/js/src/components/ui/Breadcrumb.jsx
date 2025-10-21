import { Icon } from "@iconify/react";
import { Link, usePage } from "@inertiajs/react";

const Breadcrumb = ({ title, subtitle }) => {
  const { url } = usePage();
  return (
    <div className='d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24'>
      <h6 className='fw-semibold mb-0'>{title}</h6>
      <ul className='d-flex align-items-center gap-2'>
        <li className='fw-medium'>
          <Link
            href={url}
            className='d-flex align-items-center gap-1 hover-text-primary'
          >
            <Icon
              icon='solar:home-smile-angle-outline'
              className='icon text-lg'
            />
            {subtitle}
          </Link>
        </li>
        {/* {subtitle && (
          <>
            <li> - </li>
            <li className='fw-medium'>{subtitle}</li>
          </>
        )} */}
      </ul>
    </div>
  );
};

export default Breadcrumb;
