import pytest

urlpath = '/api/v1/weather'
csvpath = 'resources/tests/routers/weather'

@pytest.mark.asyncio
async def test_select_dates_range( client, assert_against_csv ):
    response = await client.get( f"{urlpath}?time_range=2023-07-28,2023-08-06" )
    assert response.status_code == 200

    assert_against_csv( f'{csvpath}/select_dates-range.csv', response.json() )
    # csv content comes from: 
    # SELECT id, date, location_id, precipitation_sum, temperature_2m_min, temperature_2m_mean, temperature_2m_max FROM weather 
    # WHERE date>='2023-07-28' AND date<='2023-08-06' ORDER BY date, location_id;


@pytest.mark.asyncio
async def test_select_months_range( client, assert_against_csv ):
    response = await client.get( f"{urlpath}?time_range=2023-07" )
    assert response.status_code == 200

    assert_against_csv( f'{csvpath}/select_months-range.csv', response.json() )
    # csv content comes from:
    # SELECT id, date, location_id, precipitation_sum, temperature_2m_min, temperature_2m_mean, temperature_2m_max FROM weather 
    # WHERE date>='2023-07-01' AND date<='2023-07-31' ORDER BY date, location_id;


@pytest.mark.asyncio
async def test_select_dates_range_momths_avg( client, assert_against_csv ):
    response = await client.get( f"{urlpath}?time_range=2023-07-28,2023-08-06&time_aggregation=month,avg" )
    assert response.status_code == 200

    assert_against_csv( f'{csvpath}/select_dates-range_months-avg.csv', response.json() )
    # csv content comes from: 
    # SELECT SUBSTR(date::text,1,7) AS month, location_id, 
    # ROUND(AVG(precipitation_sum)::numeric,2) AS precipitation_sum,
    # ROUND(AVG(temperature_2m_min)::numeric,1) AS temperature_2m_min,
    # ROUND(AVG(temperature_2m_mean)::numeric,1) AS temperature_2m_mean,
    # ROUND(AVG(temperature_2m_max)::numeric,1) AS temperature_2m_max
    # FROM weather WHERE date>='2023-07-28' AND date<='2023-08-06'
    # GROUP BY SUBSTR(date::text,1,7), location_id ORDER BY SUBSTR(date::text,1,7), location_id;


@pytest.mark.asyncio
async def test_select_years_range_years_sum( client, assert_against_csv ):
    response = await client.get( f"{urlpath}?time_range=2022,2023&time_aggregation=year,sum" )
    assert response.status_code == 200

    assert_against_csv( f'{csvpath}/select_years-range_years-sum.csv', response.json() )
    # csv content comes from: 
    # SELECT SUBSTR(date::text,1,4) AS month, location_id, 
    # ROUND(SUM(precipitation_sum)::numeric,2) AS precipitation_sum,
    # ROUND(AVG(temperature_2m_min)::numeric,1) AS temperature_2m_min,
    # ROUND(AVG(temperature_2m_mean)::numeric,1) AS temperature_2m_mean,
    # ROUND(AVG(temperature_2m_max)::numeric,1) AS temperature_2m_max
    # FROM weather WHERE date>='2022-01-01' AND date<='2023-12-31'
    # GROUP BY SUBSTR(date::text,1,4), location_id ORDER BY SUBSTR(date::text,1,4), location_id;


@pytest.mark.asyncio
async def test_select_dates_range_locations_sum( client, assert_against_csv ):
    response = await client.get( f"{urlpath}?time_range=2023-07-28,2023-08-06&location_aggregation=sum" )
    assert response.status_code == 200

    assert_against_csv( f'{csvpath}/select_dates-range_locations-sum.csv', response.json() )
    # csv content comes from: 
    # SELECT date,  
    # ROUND(SUM(precipitation_sum)::numeric,2) AS precipitation_sum,
    # ROUND(AVG(temperature_2m_min)::numeric,1) AS temperature_2m_min,
    # ROUND(AVG(temperature_2m_mean)::numeric,1) AS temperature_2m_mean,
    # ROUND(AVG(temperature_2m_max)::numeric,1) AS temperature_2m_max
    # FROM weather WHERE date>='2023-07-28' AND date<='2023-08-06' GROUP BY date ORDER BY date;


@pytest.mark.asyncio
async def test_select_dates_range_locations_sum_momths_sum( client, assert_against_csv ):
    response = await client.get( f"{urlpath}?time_range=2023-07-28,2023-08-06&location_aggregation=sum&time_aggregation=month,sum" )
    assert response.status_code == 200

    assert_against_csv( f'{csvpath}/select_dates-range_locations-sum_months-sum.csv', response.json() )
    # csv content comes from: 
    # SELECT SUBSTR(date::text,1,7) AS month, 
    # ROUND(SUM(precipitation_sum)::numeric,2) AS precipitation_sum,
    # ROUND(AVG(temperature_2m_min)::numeric,1) AS temperature_2m_min,
    # ROUND(AVG(temperature_2m_mean)::numeric,1) AS temperature_2m_mean,
    # ROUND(AVG(temperature_2m_max)::numeric,1) AS temperature_2m_max
    # FROM (
    # SELECT date, 
    # ROUND(SUM(precipitation_sum)::numeric,2) AS precipitation_sum,
    # ROUND(AVG(temperature_2m_min)::numeric,1) AS temperature_2m_min,
    # ROUND(AVG(temperature_2m_mean)::numeric,1) AS temperature_2m_mean,
    # ROUND(AVG(temperature_2m_max)::numeric,1) AS temperature_2m_max
    # FROM weather WHERE date>='2023-07-28' AND date<='2023-08-06' GROUP BY date
    # ) a
    # GROUP BY SUBSTR(a.date::text,1,7) ORDER BY SUBSTR(a.date::text,1,7);


@pytest.mark.asyncio
async def test_select_years_range_locations_sum_years_sum( client, assert_against_csv ):
    response = await client.get( f"{urlpath}?time_range=2022,2023&location_aggregation=sum&time_aggregation=year,sum" )
    assert response.status_code == 200

    assert_against_csv( f'{csvpath}/select_years-range_locations-sum_years-sum.csv', response.json() )
    # csv content comes from: 
    # SELECT SUBSTR(date::text,1,4) AS year, 
    # ROUND(SUM(precipitation_sum)::numeric,2) AS precipitation_sum,
    # ROUND(AVG(temperature_2m_min)::numeric,1) AS temperature_2m_min,
    # ROUND(AVG(temperature_2m_mean)::numeric,1) AS temperature_2m_mean,
    # ROUND(AVG(temperature_2m_max)::numeric,1) AS temperature_2m_max
    # FROM (
    #   SELECT date, 
    #   ROUND(SUM(precipitation_sum)::numeric,2) AS precipitation_sum,
    #   ROUND(AVG(temperature_2m_min)::numeric,1) AS temperature_2m_min,
    #   ROUND(AVG(temperature_2m_mean)::numeric,1) AS temperature_2m_mean,
    #   ROUND(AVG(temperature_2m_max)::numeric,1) AS temperature_2m_max
    #    FROM weather WHERE date>='2022-01-01' AND date<='2023-12-31' GROUP BY date
    # ) a
    # GROUP BY SUBSTR(a.date::text,1,4) ORDER BY SUBSTR(a.date::text,1,4);


@pytest.mark.asyncio
async def test_select_years_range_interval_filter( client, assert_against_csv ):
    response = await client.get( f"{urlpath}?time_range=2022,2023&interval_filter=07-28,08-16" )
    assert response.status_code == 200

    assert_against_csv( f'{csvpath}/select_years-range_interval-filter.csv', response.json() )
    # csv content comes from: 
    # SELECT id, date, location_id, 
    # precipitation_sum, temperature_2m_min, temperature_2m_mean, temperature_2m_max FROM weather 
    # WHERE date>='2022-01-01' AND date<='2023-12-31' AND (SUBSTR(date::text,6,5)>='07-28' AND SUBSTR(date::text,6,5)<='08-16')
    # ORDER BY date, location_id;


@pytest.mark.asyncio
async def test_select_years_range_locations_sum_years_avg_interval_filter( client, assert_against_csv ):
    response = await client.get( f"{urlpath}?time_range=2022,2023&location_aggregation=sum&time_aggregation=year,avg&interval_filter=07-28,08-16" )
    assert response.status_code == 200

    assert_against_csv( f'{csvpath}/select_years-range_locations-sum_years-avg_interval-filter.csv', response.json() )
    # csv content comes from: 
    # SELECT SUBSTR(date::text,1,4) AS year, 
    # ROUND(AVG(precipitation_sum)::numeric,2) AS precipitation_sum,
    # ROUND(AVG(temperature_2m_min)::numeric,1) AS temperature_2m_min,
    # ROUND(AVG(temperature_2m_mean)::numeric,1) AS temperature_2m_mean,
    # ROUND(AVG(temperature_2m_max)::numeric,1) AS temperature_2m_max
    # FROM (
    # SELECT date, 
    # ROUND(SUM(precipitation_sum)::numeric,2) AS precipitation_sum,
    # ROUND(AVG(temperature_2m_min)::numeric,1) AS temperature_2m_min,
    # ROUND(AVG(temperature_2m_mean)::numeric,1) AS temperature_2m_mean,
    # ROUND(AVG(temperature_2m_max)::numeric,1) AS temperature_2m_max
    # FROM weather WHERE date>='2022-01-01' AND date<='2023-12-31' AND (SUBSTR(date::text,6,5)>='07-28' AND SUBSTR(date::text,6,5)<='08-16') GROUP BY date
    # ) a
    # GROUP BY SUBSTR(a.date::text,1,4) ORDER BY SUBSTR(a.date::text,1,4);


@pytest.mark.asyncio
async def test_select_dates_range_custom_years_sum( client, assert_against_csv ):
    response = await client.get( f"{urlpath}?time_range=2021-10-01,2023-09-30&time_aggregation=year,sum&year_start=10-01" )
    assert response.status_code == 200

    assert_against_csv( f'{csvpath}/select_dates-range_custom-years-sum.csv', response.json() )
    # csv content comes from: 
    # SELECT b.custom_year, b.location_id, 
    # ROUND(SUM(b.precipitation_sum)::numeric,2) AS precipitation_sum,
    # ROUND(AVG(b.temperature_2m_min)::numeric,1) AS temperature_2m_min,
    # ROUND(AVG(b.temperature_2m_mean)::numeric,1) AS temperature_2m_mean,
    # ROUND(AVG(b.temperature_2m_max)::numeric,1) AS temperature_2m_max
    # FROM (
    # SELECT
    #     CASE WHEN SUBSTR(a.date::text,6,5)>='10-01'
    #     THEN SUBSTR(a.date::text,1,4) || '-' || CAST(SUBSTR(a.date::text,1,4) AS INTEGER)+1
    #     ELSE CAST(SUBSTR(a.date::text,1,4) AS INTEGER)-1 || '-' || SUBSTR(a.date::text,1,4) 
    #     END AS custom_year,
    #     a.location_id,
    #     a.precipitation_sum,
    #     a.temperature_2m_min,
    #     a.temperature_2m_mean,
    #     a.temperature_2m_max
    # FROM ( 
    #     SELECT * FROM weather WHERE date>='2021-10-01' AND date<='2023-09-30' 
    # ) a
    # ) b
    # GROUP BY b.custom_year, b.location_id
    # ORDER BY b.custom_year, b.location_id;


@pytest.mark.asyncio
async def test_select_dates_range_locations_sum_custom_years_avg( client, assert_against_csv ):
    response = await client.get( f"{urlpath}?time_range=2021-10-01,2023-09-30&location_aggregation=sum&time_aggregation=year,avg&year_start=10-01" )
    assert response.status_code == 200

    assert_against_csv( f'{csvpath}/select_dates-range_locations-sum_custom-years-avg.csv', response.json() )
    # csv content comes from: 
    # SELECT b.custom_year, 
    # ROUND(AVG(b.precipitation_sum)::numeric,2) AS precipitation_sum,
    # ROUND(AVG(b.temperature_2m_min)::numeric,1) AS temperature_2m_min,
    # ROUND(AVG(b.temperature_2m_mean)::numeric,1) AS temperature_2m_mean,
    # ROUND(AVG(b.temperature_2m_max)::numeric,1) AS temperature_2m_max
    # FROM (
    #     SELECT
    #     CASE WHEN SUBSTR(a.date::text,6,5)>='10-01'
    #     THEN SUBSTR(a.date::text,1,4) || '-' || CAST(SUBSTR(a.date::text,1,4) AS INTEGER)+1
    #     ELSE CAST(SUBSTR(a.date::text,1,4) AS INTEGER)-1 || '-' || SUBSTR(a.date::text,1,4) 
    #     END AS custom_year,
    #     a.precipitation_sum,
    #     a.temperature_2m_min,
    #     a.temperature_2m_mean,
    #     a.temperature_2m_max
    # FROM ( 
    #     SELECT date, 
    #     ROUND(SUM(precipitation_sum)::numeric,2) AS precipitation_sum,
    #     ROUND(AVG(temperature_2m_min)::numeric,1) AS temperature_2m_min,
    #     ROUND(AVG(temperature_2m_mean)::numeric,1) AS temperature_2m_mean,
    #     ROUND(AVG(temperature_2m_max)::numeric,1) AS temperature_2m_max
    #     FROM weather WHERE date>='2021-10-01' AND date<='2023-09-30'
    #     GROUP BY date
    # ) a
    # ) b
    # GROUP BY b.custom_year
    # ORDER BY b.custom_year;
