import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Menu, CircleX } from 'lucide-react';
import { sidebarData, tenAdminSidebarData } from '@/helpers/sidebarItems';
import TenLogo from '../../assets/TenLogo.svg';
import Typography from '@mui/material/Typography';
import './styles.scss';
import { Outlet, useNavigate } from 'react-router-dom';
import SmallLogo from '../../assets/SmallLogo.png';
import DownArrow from '@/assets/Icons/downArrow.png';
import UpArrow from '@/assets/Icons/UpArrow.png';
import Button from '../Button';
import NavBell from '@/assets/NavBell.svg';
import AccountsDropdownMUI from '../AccountsDropdownMUI';
import Mail from '@/assets/mail.svg';
import User from '@/assets/user.svg';
import Logout from '@/assets/log-out.svg';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/redux/store';
import {
  setSideBarOpen,
  setTitle,
  setTopBarConfig,
  toggleSideBar,
} from '@/features/layout/layoutSlice';
import { usePageTitle } from '@/hooks/usePageTitle';
import SearchBar from '../SearchBar';
import BackButton from '@/assets/BackButton.svg';
import { AuthStorage } from '@/services/auth';
import type { UserInfo, UserRole } from '@/services/auth';
import { Box } from '@mui/material';
import { getTransformedPermissions } from '@/helpers/utils';
import { allPermissions, permissionsData } from '@/helpers/data';

const sidebarDropdownOptions = ['All Accounts', '342893-90233', '34324-00945'];

const PageLayout = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [userRoles, setUserRoles] = useState<UserRole[] | null>(null);
  const [currentRole, setCurrentRole] = useState<{ role_id: string; role_name: string } | null>(
    null
  );
  const topBarConfig = useSelector((state: RootState) => state.layout);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('US-English');

  useEffect(() => {
    const tokens = AuthStorage.getTokens();
    if (!tokens || AuthStorage.isTokenExpired()) {
      AuthStorage.clearTokens();
      navigate('/login');
    } else {
      setUserInfo(tokens.user_info);
      setUserRoles(tokens.user_roles);

      // Get current role from localStorage
      const role = AuthStorage.getCurrentRole();
      setCurrentRole(role);
    }
  }, [navigate]);

  // Redirect TenAdmin users to /account-management/accounts
  useEffect(() => {
    if (userRoles?.some(role => role.name === 'TenAdmin')) {
      const currentPath = window.location.pathname;
      if (currentPath === '/' || currentPath === '/dashboard') {
        navigate('/customers');
      }
    }
  }, [userRoles, navigate]);

  const handleLogout = () => {
    AuthStorage.clearTokens();

    window.location.replace('/login');
    const auth0Domain = import.meta.env.VITE_AUTH0_DOMAIN;
    const clientId = import.meta.env.VITE_AUTH0_CLIENTID;
    const returnTo = encodeURIComponent(window.location.origin);
    window.location.href = `https://${auth0Domain}/v2/logout?client_id=${clientId}&returnTo=${returnTo}`;
  };

  const handleSelect = (lang: string) => {
    setSelectedLang(lang);
    setIsOpen(false);
  };
  const {
    title: selectedItem,
    isSideBarOpen: isSidebarOpen,
    extraContent,
    showBackButton,
    showSearch,
  } = topBarConfig;

  const dispatch = useDispatch();

  usePageTitle();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 767);
      if (window.innerWidth <= 767) {
        dispatch(setSideBarOpen(false));
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    dispatch(toggleSideBar());
  };

  const toggleExpanded = (itemId: number) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const handleItemClick = (item: any, parentId: number | null = null) => {
    if (item?.disabled) {
      return;
    }

    dispatch(setTitle(item.label));
    if (item.link) {
      navigate(item.link);
    }
    if (isMobile) {
      dispatch(setSideBarOpen(false));
    }
  };
  const renderSidebarItem = (item: any, level: number = 0, parentId: number | null = null) => {
    if (item.isSection) {
      return isSidebarOpen ? (
        <>
          {item.label === 'Settings' && <div className="layout__horizontal-separator" />}
          <div key={item.id} className="layout__section-header">
            <Typography variant="body2" className="section-title">
              {item.label}
            </Typography>
          </div>
        </>
      ) : null;
    }

    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems[item.id];
    const isActive =
      selectedItem === item.label ||
      (item.children && item.children.some((child: any) => selectedItem === child.label));
    const isDisabled = item?.disabled;

    // Permissions logic

    // const testPermissions = [
    //   { permission_name: 'read:dashboard' },
    //   { permission_name: 'read:fleet-map-view' },
    //   { permission_name: 'read:telematics-activity-feed' },
    // ];

    const testPermissions = allPermissions.map(name => ({
      permission_name: name,
    }));

    // Filter permissions for the current module
    const modulePermissionData = permissionsData.filter(obj => obj.moduleName === item.module);
    // Transform permissions to match the expected format
    const requiredPermissions = getTransformedPermissions(modulePermissionData);
    // Check if the user has any of the required permissions for the module
    const hasModuleAccess = requiredPermissions.some(permission =>
      testPermissions.some(testPermission => testPermission.permission_name === permission)
    );

    const subModules = hasChildren ? item.children : [];

    // Filter permissions for submodules
    const subModulePermissionData = subModules
      .map((subModule: any) => {
        return permissionsData.filter(obj => obj.moduleName === subModule.module) || undefined;
      })
      .filter((item: any) => item !== undefined)
      .flat();

    const subModulePermissions = getTransformedPermissions(subModulePermissionData);

    const hasSubModuleAccess = subModulePermissions.some(permission =>
      testPermissions.some(testPermission => testPermission.permission_name === permission)
    );

    const globalSubModules = subModules.some((subModule: any) => !subModule.module);

    const isAvailable =
      // Check if the item is available based on permissions (module specified)
      (!hasChildren && hasModuleAccess) ||
      // Check if the item has children and the user has access to any of them (module specified)
      (hasChildren && hasSubModuleAccess) ||
      // Check if the item is available globally (no module specified)
      (!hasChildren && !item.module) ||
      // Check if the item has children and is globally available (no module specified)
      (hasChildren && globalSubModules);

    return (
      isAvailable && (
        <div key={item.id} className="layout__sidebar-item-wrapper">
          <div
            className={`layout__sidebar-item ${isActive ? 'active' : ''} ${
              !isSidebarOpen ? 'collapsed' : ''
            } ${level > 0 ? 'child-item' : ''} ${isDisabled ? 'disabled' : ''}`}
            onClick={() => {
              if (isDisabled) {
                return;
              }
              if (hasChildren) {
                toggleExpanded(item.id);
              } else {
                handleItemClick(item, parentId);
              }
            }}
          >
            <div className="layout__item-content">
              {item.icon && (
                <div className="sidebar-icon-container">
                  <img
                    className={`sidebar-icon ${isActive ? 'active' : ''} ${
                      isDisabled ? 'disabled' : ''
                    }`}
                    src={item.icon}
                  />
                </div>
              )}

              {isSidebarOpen && (
                <>
                  <div className="sidebar-label-container">
                    <Typography
                      className={`sidebar-label ${isActive ? 'active' : ''} ${
                        isDisabled ? 'disabled' : ''
                      }`}
                      sx={{ fontWeight: 400 }}
                      variant="body2"
                    >
                      {item.label}
                    </Typography>
                  </div>

                  {hasChildren && !isDisabled && (
                    <div className="expand-icon">
                      {isExpanded ? (
                        <img src={UpArrow} alt="upArrow" style={{ fontSize: 30 }} />
                      ) : (
                        <img src={DownArrow} alt="downArrow" />
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {hasChildren && isExpanded && isSidebarOpen && (
            <div className="layout__sidebar-children">
              {item.children.map((child: any) => renderSidebarItem(child, level + 1, item.id))}
            </div>
          )}
        </div>
      )
    );
  };

  // Check if sidebar dropdown should be hidden
  const shouldHideSidebarDropdown = currentRole?.role_id === '1';

  const handleBack = () => {
    dispatch(
      setTopBarConfig({
        isBackClicked: true,
      })
    );
  };

  return (
    <div className="layout">
      {isMobile && isSidebarOpen && (
        <div className="layout__mobile-overlay" onClick={toggleSidebar}></div>
      )}

      {isMobile && (
        <div className="layout__mobile-header">
          <Menu className="hamburger" onClick={toggleSidebar} size={24} />
          <div className="mobile-logo">
            <div className="layout__navbar-logo-icon">
              <img src={TenLogo} alt="TEN" className="logo-image" />
            </div>
          </div>
          <div className="layout__profile-dropdown">
            <div
              className="layout__profile-btn"
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  src={User}
                  alt="Profile"
                  style={{ width: 16, height: 16, filter: 'brightness(0) invert(1)' }}
                />
              </Box>
              <ChevronDown size={16} />
            </div>

            {showProfileDropdown && (
              <div className="layout__dropdown-menu">
                <div className="dropdown-status">
                  <span className="active-dot" />
                  <span className="active-text">Active</span>
                </div>
                <div className="dropdown-divider" />
                <div className="layout__dropdown-item">
                  <img src={Mail} />
                  <Typography variant="label1">{userInfo?.email}</Typography>
                </div>
                <div className="layout__dropdown-item">
                  <img src={User} />
                  <Typography variant="label1">My Profile</Typography>
                </div>
                <div className="dropdown-divider" />
                <div className="layout__dropdown-item" onClick={handleLogout}>
                  <img src={Logout} />
                  <Typography variant="label1">Logout</Typography>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div
        className={`layout__sidebar ${
          isMobile
            ? isSidebarOpen
              ? 'mobile-open'
              : 'mobile-hidden'
            : isSidebarOpen
            ? 'desktop-open'
            : 'desktop-closed'
        }`}
      >
        <div className="layout__navbar-logo">
          <div className="layout__navbar-logo-icon">
            {isSidebarOpen ? (
              <img src={TenLogo} alt="TEN Full" className="logo-image" />
            ) : (
              <img src={SmallLogo} alt="TEN Full" className="small-logo-image" />
            )}
          </div>

          {isMobile && (
            <div className="close-icon">
              <CircleX onClick={toggleSidebar} size={20} />
            </div>
          )}
        </div>
        {!shouldHideSidebarDropdown && (
          <div className="sidebar-drop-down">
            {isSidebarOpen ? (
              <AccountsDropdownMUI
                placeholder="Select Account Number"
                onValueChanged={value => {
                  console.log('Selected accounts:', value);
                }}
              />
            ) : (
              ''
            )}
          </div>
        )}
        <div className="layout__sidebar-content">
          <div className="sidebar-items">
            {(userRoles?.some(role => role.name === 'TenAdmin')
              ? tenAdminSidebarData
              : sidebarData
            ).map(item => renderSidebarItem(item))}
          </div>
        </div>

        {!isMobile && (
          <div className="layout__sidebar-toggle">
            <button className="toggle-button" onClick={toggleSidebar}>
              <ChevronRight
                size={24}
                style={{
                  transform: isSidebarOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease',
                }}
              />
            </button>
          </div>
        )}

        <div className="layout__sidebar-footer">
          {isSidebarOpen && (
            <div className="language-selector">
              <div className="language-section" onClick={() => setIsOpen(!isOpen)}>
                <div>
                  <Typography className="language-title" variant="body2">
                    Language:
                  </Typography>
                  <Typography className="language-value" variant="body2">
                    {selectedLang}
                  </Typography>
                </div>
                <ChevronDown className="down-arrow" />
              </div>

              {isOpen && (
                <div className="language-options">
                  {['US-English', 'FR-French'].map(lang => (
                    <label
                      key={lang}
                      className={`language-option ${selectedLang === lang ? 'selected' : ''}`}
                      onChange={() => handleSelect(lang)}
                    >
                      <input
                        type="radio"
                        name="language"
                        value={lang}
                        checked={selectedLang === lang}
                      />
                      <Typography fontWeight={500} variant="body2">
                        {lang}
                      </Typography>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="copyright">
            <Typography variant="caption" sx={{ fontWeight: 400 }}>
              © 2025
              {isSidebarOpen && <> Copyright Ten Next Gen All rights reserved.</>}
            </Typography>
          </div>
        </div>
      </div>

      <div
        className={`layout__main-content ${!isSidebarOpen && !isMobile ? 'sidebar-closed' : ''}`}
      >
        <div className="content-body">
          {!isMobile && (
            <div className="layout__nav-section">
              <div className="nav-left-section">
                {showBackButton && (
                  <img
                    src={BackButton}
                    onClick={handleBack}
                    alt="back-button"
                    className="back-button"
                  />
                )}
                <Typography color="#000" variant="h6">
                  {selectedItem}
                </Typography>
                <Typography sx={{ fontWeight: 600 }}>{extraContent}</Typography>

                {showSearch && <SearchBar placeholder="Search" />}
              </div>
              <div className="nav-right-section">
                <Button className="access-btn" size="fit">
                  Request Service
                </Button>
                <div>
                  <img src={NavBell} alt="notification" className="nav-bell" />
                </div>
                <div
                  className="layout__profile-btn"
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                >
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      backgroundColor: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <img
                      src={User}
                      alt="Profile"
                      style={{ width: 16, height: 16, filter: 'brightness(0) invert(1)' }}
                    />
                  </Box>

                  <div className="profile-texts">
                    <Typography variant="body2" className="welcome-text">
                      Hi, Welcome
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }} className="profile-name">
                      {userInfo?.name}
                    </Typography>
                  </div>
                  <ChevronDown size={16} style={{ marginLeft: 20 }} />
                </div>

                {showProfileDropdown && (
                  <div className="layout__dropdown-menu">
                    <div className="dropdown-status">
                      <span className="active-dot" />
                      <span className="active-text">Active</span>
                    </div>
                    <div className="dropdown-divider" />
                    <div className="layout__dropdown-item">
                      <img src={Mail} alt="mail" />
                      <Typography variant="label1">{userInfo?.email}</Typography>
                    </div>
                    <div className="layout__dropdown-item">
                      <img src={User} alt="user" />
                      <Typography variant="label1">My Profile</Typography>
                    </div>
                    <div className="dropdown-divider" />
                    <div className="layout__dropdown-item" onClick={handleLogout}>
                      <img src={Logout} alt="logout" />
                      <Typography variant="label1">Logout</Typography>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="dashboard-content">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageLayout;
