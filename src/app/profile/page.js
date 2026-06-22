'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '../../context/AuthContext'
import API from '../../lib/api'
import SubBanner from '../../components/SubBanner'

export default function Profile() {
  const { isLoggedIn, user, logout } = useAuth()
  const [orders, setOrders] = useState([])

  useEffect(() => {
    if (isLoggedIn) {
      API.get('/orders/my?limit=5')
        .then(({ data }) => setOrders(data.orders || []))
        .catch(() => {})
    }
  }, [isLoggedIn])

  if (!isLoggedIn) {
    return (
      <>
        <SubBanner title="My Profile" description="Please login to view your profile." page="Profile" />
        <div className="profile-page">
          <div className="profile-login-prompt">
            <h3>Please Login</h3>
            <p>You need to be logged in to view your profile.</p>
            <Link href="/login" className="btn">Login</Link>
          </div>
        </div>
      </>
    )
  }

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U'

  return (
    <>
      <SubBanner title="My Profile" description="Manage your account details and view recent orders." page="Profile" />
      <div className="profile-page">
        <div className="container">
          <h1>My Profile</h1>
          <div className="profile-card">
            <div className="profile-card-header">
              <div className="profile-avatar">{initials}</div>
              <div className="profile-card-info">
                <h5>{user?.name}</h5>
                <p>{user?.email}</p>
              </div>
            </div>
            <div className="profile-card-body">
              <div className="detail-row">
                <span>Name</span>
                <span>{user?.name || '-'}</span>
              </div>
              <div className="detail-row">
                <span>Email</span>
                <span>{user?.email || '-'}</span>
              </div>
              {user?.phone && (
                <div className="detail-row">
                  <span>Phone</span>
                  <span>{user.phone}</span>
                </div>
              )}
            </div>
            <button onClick={logout} className="profile-logout-btn">
              <i className="fa-solid fa-right-from-bracket" /> Sign Out
            </button>
          </div>

          <h2>Recent Orders</h2>
          {orders.length > 0 ? (
            <>
              <div className="profile-orders-list">
                {orders.map(order => (
                  <div key={order._id} className="profile-order-item">
                    <span className="profile-order-id">#{order._id?.slice(-8).toUpperCase()}</span>
                    <span className="profile-order-total">${order.total?.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <Link href="/my-orders" className="profile-view-link">
                View All Orders <i className="fa-solid fa-arrow-right" />
              </Link>
            </>
          ) : (
            <p className="profile-no-orders">No recent orders.</p>
          )}
        </div>
      </div>
    </>
  )
}
