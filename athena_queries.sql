--Calculate Total Revenue by Brand-

SELECT brand, SUM(CAST(price AS DOUBLE)) AS total_revenue
FROM "clickstream-data"."clickstream-output-parquet"
WHERE event_type = 'purchase'
GROUP BY brand
ORDER BY total_revenue DESC;

--Duration and Analysis of the Attack-

WITH user_events AS (
    SELECT 
        user_id,
        event_type,
        from_iso8601_timestamp(txn_timestamp) AS txn_time,
        LAG(from_iso8601_timestamp(txn_timestamp), 1) OVER (PARTITION BY user_id ORDER BY from_iso8601_timestamp(txn_timestamp)) AS prev_txn_time
    FROM "clickstream-data"."clickstream-output-parquet"
    WHERE user_id = '520088904'
)
SELECT 
    user_id,
    event_type,
    txn_time,
    prev_txn_time,
    (txn_time - prev_txn_time) AS time_diff
FROM user_events
ORDER BY txn_time DESC;

--Top 10 popular products-

SELECT product_id, COUNT(*) AS purchase_count
FROM "clickstream-data"."clickstream-output-parquet"
WHERE event_type = 'purchase'
GROUP BY product_id
ORDER BY purchase_count DESC
LIMIT 10;

--Attack Event Counts in Specific Timeframes

SELECT 
    user_id,
    date_format(from_iso8601_timestamp(txn_timestamp), '%Y-%m-%d %H:%i') AS event_minute,
    COUNT(*) AS event_count
FROM "clickstream-data"."clickstream-output-parquet"
WHERE user_id = '520088904'
GROUP BY user_id, date_format(from_iso8601_timestamp(txn_timestamp), '%Y-%m-%d %H:%i')
ORDER BY date_format(from_iso8601_timestamp(txn_timestamp), '%Y-%m-%d %H:%i') DESC;

--Average price-

SELECT category_code, AVG(CAST(price AS DOUBLE)) AS average_price
FROM "clickstream-data"."clickstream-output-parquet"
WHERE event_type = 'purchase'
GROUP BY category_code
ORDER BY average_price DESC;

--Top 5 by revenue-

SELECT category_code, SUM(CAST(price AS DOUBLE)) AS total_revenue
FROM "clickstream-data"."clickstream-output-parquet"
WHERE event_type = 'purchase'
GROUP BY category_code
ORDER BY total_revenue DESC
LIMIT 5;

--potential DDos-

WITH user_activity AS (
    SELECT 
        user_id,
        COUNT(*) AS event_count,
        MIN(from_iso8601_timestamp(txn_timestamp)) AS first_event_time,
        MAX(from_iso8601_timestamp(txn_timestamp)) AS last_event_time
    FROM "clickstream-data"."clickstream-output-parquet"
    WHERE from_iso8601_timestamp(txn_timestamp) >= (CURRENT_TIMESTAMP - INTERVAL '1' MINUTE)
    GROUP BY user_id
)
SELECT 
    user_id,
    event_count,
    first_event_time,
    last_event_time,
    (last_event_time - first_event_time) AS time_difference
FROM user_activity
WHERE event_count > 4
ORDER BY event_count DESC;


--conversion rate calculation-

WITH user_sessions AS (
    SELECT user_session,
           COUNT(*) AS session_events,
           SUM(CASE WHEN event_type = 'purchase' THEN 1 ELSE 0 END) AS purchase_events
    FROM "clickstream-data"."clickstream-output-parquet"
    GROUP BY user_session
)
SELECT COUNT(*) AS total_sessions,
       SUM(CASE WHEN purchase_events > 0 THEN 1 ELSE 0 END) AS sessions_with_purchase,
       (SUM(CASE WHEN purchase_events > 0 THEN 1 ELSE 0 END) * 1.0 / COUNT(*)) AS conversion_rate
FROM user_sessions;

--Average session duration-

SELECT user_session, 
       MIN(CAST(event_time AS TIMESTAMP)) AS session_start,
       MAX(CAST(event_time AS TIMESTAMP)) AS session_end,
       (MAX(CAST(event_time AS TIMESTAMP)) - MIN(CAST(event_time AS TIMESTAMP))) AS session_duration
FROM "clickstream-data"."clickstream-output-parquet"
GROUP BY user_session
ORDER BY session_duration DESC
LIMIT 10;
