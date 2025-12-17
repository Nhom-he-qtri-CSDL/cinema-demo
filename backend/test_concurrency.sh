#!/bin/bash

# Test script for concurrency control demo
# This script simulates multiple users trying to book the same seat simultaneously

echo "🎬 Cinema Booking Concurrency Test"
echo "=================================="
echo ""

# Server URL
SERVER="http://localhost:8080"

# Test seat ID (should exist in sample data)
SEAT_ID=1

echo "📋 Step 1: Check seat availability"
curl -s "$SERVER/api/seats?show_id=1" | jq '.seats[] | select(.seat_id == 1)'
echo ""

echo "🚀 Step 2: Simultaneous booking attempts (3 users for same seat)"
echo "This will demonstrate concurrency control - only ONE should succeed!"
echo ""

# Run 3 concurrent booking requests for the same seat
(
  echo "User 1 booking attempt..."
  curl -s -X POST "$SERVER/api/book" \
    -H "Content-Type: application/json" \
    -H "X-User-ID: 1" \
    -d "{\"seat_id\": $SEAT_ID}" &
    
  echo "User 2 booking attempt..."  
  curl -s -X POST "$SERVER/api/book" \
    -H "Content-Type: application/json" \
    -H "X-User-ID: 2" \
    -d "{\"seat_id\": $SEAT_ID}" &
    
  echo "User 3 booking attempt..."
  curl -s -X POST "$SERVER/api/book" \
    -H "Content-Type: application/json" \
    -H "X-User-ID: 3" \
    -d "{\"seat_id\": $SEAT_ID}" &
    
  wait
) | while IFS= read -r line; do
  echo "$line"
done

echo ""
echo "📊 Step 3: Verify final seat status"
curl -s "$SERVER/api/seats?show_id=1" | jq '.seats[] | select(.seat_id == 1)'

echo ""
echo "🎯 Expected Result:"
echo "- Only ONE booking should succeed (200 OK)"
echo "- Other attempts should fail (409 Conflict)"
echo "- Seat status should be 'BOOKED'"
echo "- This proves PostgreSQL handled concurrency correctly!"
