import pytest

urlpath = '/api/v1/production'
csvpath = 'resources/tests/routers/production'

@pytest.mark.asyncio
async def test_select_dates_range( client, assert_against_csv ):
    response = await client.get( f"{urlpath}?time_range=2023-07-28,2023-08-06" )
    assert response.status_code == 200

    assert_against_csv( f'{csvpath}/select_dates-range.csv', response.json() )
    # csv content comes from: 
    # SELECT id, date, factory_id, quantity FROM production 
    # WHERE date>='2023-07-28' AND date<='2023-08-06' ORDER BY date, factory_id;


@pytest.mark.asyncio
async def test_select_months_range( client, assert_against_csv ):
    response = await client.get( f"{urlpath}?time_range=2023-07" )
    assert response.status_code == 200

    assert_against_csv( f'{csvpath}/select_months-range.csv', response.json() )
    # csv content comes from:
    # SELECT id, date, factory_id, quantity FROM production 
    # WHERE date>='2023-07-01' AND date<='2023-07-31' ORDER BY date, factory_id;


@pytest.mark.asyncio
async def test_select_dates_range_momths_avg( client, assert_against_csv ):
    response = await client.get( f"{urlpath}?time_range=2023-07-28,2023-08-06&time_aggregation=month,avg" )
    assert response.status_code == 200

    assert_against_csv( f'{csvpath}/select_dates-range_months-avg.csv', response.json() )
    # csv content comes from: 
    # SELECT SUBSTR(date,1,7) AS month, factory_id, ROUND(AVG(quantity),2) AS quantity FROM production 
    # WHERE date>='2023-07-28' AND date<='2023-08-06'
    # GROUP BY SUBSTR(date,1,7), factory_id ORDER BY SUBSTR(date,1,7), factory_id;


@pytest.mark.asyncio
async def test_select_years_range_years_sum( client, assert_against_csv ):
    response = await client.get( f"{urlpath}?time_range=2022,2023&time_aggregation=year,sum" )
    assert response.status_code == 200

    assert_against_csv( f'{csvpath}/select_years-range_years-sum.csv', response.json() )
    # csv content comes from: 
    # SELECT SUBSTR(date,1,4) AS year, factory_id, SUM(quantity) AS quantity FROM production 
    # WHERE date>='2022-01-01' AND date<='2023-12-31'
    # GROUP BY SUBSTR(date,1,4), factory_id ORDER BY SUBSTR(date,1,4), factory_id;


@pytest.mark.asyncio
async def test_select_dates_range_factories_sum( client, assert_against_csv ):
    response = await client.get( f"{urlpath}?time_range=2023-07-28,2023-08-06&factory_aggregation=sum" )
    assert response.status_code == 200

    assert_against_csv( f'{csvpath}/select_dates-range_factories-sum.csv', response.json() )
    # csv content comes from: 
    # SELECT date, SUM(quantity) AS quantity FROM production 
    # WHERE date>='2023-07-28' AND date<='2023-08-06' GROUP BY date ORDER BY date;


@pytest.mark.asyncio
async def test_select_dates_range_factories_sum_momths_avg( client, assert_against_csv ):
    response = await client.get( f"{urlpath}?time_range=2023-07-28,2023-08-06&factory_aggregation=sum&time_aggregation=month,avg" )
    assert response.status_code == 200

    assert_against_csv( f'{csvpath}/select_dates-range_factories-sum_months-avg.csv', response.json() )
    # csv content comes from: 
    # SELECT SUBSTR(date,1,7) AS month, ROUND(AVG(quantity),2) AS quantity FROM 
    # (
    #   SELECT date, SUM(quantity) AS quantity FROM production 
    #   WHERE date>='2023-07-28' AND date<='2023-08-06' GROUP BY date
    # ) a
    # GROUP BY SUBSTR(a.date,1,7) ORDER BY SUBSTR(a.date,1,7);


@pytest.mark.asyncio
async def test_select_years_range_factories_sum_years_avg( client, assert_against_csv ):
    response = await client.get( f"{urlpath}?time_range=2022,2023&factory_aggregation=sum&time_aggregation=year,avg" )
    assert response.status_code == 200

    assert_against_csv( f'{csvpath}/select_years-range_factories-sum_years-avg.csv', response.json() )
    # csv content comes from: 
    # SELECT SUBSTR(date,1,4) AS year, ROUND(AVG(quantity),2) AS quantity FROM 
    # (
    #   SELECT date, SUM(quantity) AS quantity FROM production 
    #   WHERE date>='2022-01-01' AND date<='2023-12-31' GROUP BY date
    # ) a
    # GROUP BY SUBSTR(a.date,1,4) ORDER BY SUBSTR(a.date,1,4);


@pytest.mark.asyncio
async def test_select_years_range_interval_filter( client, assert_against_csv ):
    response = await client.get( f"{urlpath}?time_range=2022,2023&interval_filter=07-28,08-16" )
    assert response.status_code == 200

    assert_against_csv( f'{csvpath}/select_years-range_interval-filter.csv', response.json() )
    # csv content comes from: 
    # SELECT id, date, factory_id, quantity FROM production 
    # WHERE date>='2022-01-01' AND date<='2023-12-31' AND (SUBSTR(date,6,5)>='07-28' AND SUBSTR(date,6,5)<='08-16')
    # ORDER BY date, factory_id;


@pytest.mark.asyncio
async def test_select_years_range_factories_sum_years_avg_interval_filter( client, assert_against_csv ):
    response = await client.get( f"{urlpath}?time_range=2022,2023&factory_aggregation=sum&time_aggregation=year,avg&interval_filter=07-28,08-16" )
    assert response.status_code == 200

    assert_against_csv( f'{csvpath}/select_years-range_factories-sum_years-avg_interval-filter.csv', response.json() )
    # csv content comes from: 
    # SELECT SUBSTR(date,1,4) AS year, ROUND(AVG(quantity),2) AS quantity FROM 
    # (
    #   SELECT date, SUM(quantity) AS quantity FROM production 
    #   WHERE date>='2022-01-01' AND date<='2023-12-31' AND (SUBSTR(date,6,5)>='07-28' AND SUBSTR(date,6,5)<='08-16') GROUP BY date
    # ) a
    # GROUP BY SUBSTR(a.date,1,4) ORDER BY SUBSTR(a.date,1,4);


@pytest.mark.asyncio
async def test_select_dates_range_custom_years_avg( client, assert_against_csv ):
    response = await client.get( f"{urlpath}?time_range=2021-10-01,2023-09-30&time_aggregation=year,avg&year_start=10-01" )
    assert response.status_code == 200

    assert_against_csv( f'{csvpath}/select_dates-range_custom-years-avg.csv', response.json() )
    # csv content comes from: 
    # SELECT b.custom_year, b.factory_id, ROUND(AVG(b.quantity),2) AS quantity
    # FROM (
    # SELECT
    #     CASE WHEN SUBSTR(a.date,6,5)>='10-01'
    #     THEN SUBSTR(a.date,1,4) || '-' || CAST(SUBSTR(a.date,1,4) AS INTEGER)+1
    #     ELSE CAST(SUBSTR(a.date,1,4) AS INTEGER)-1 || '-' || SUBSTR(a.date,1,4) 
    #     END AS custom_year,
    #     a.factory_id,
    #     a.quantity
    # FROM ( 
    #     SELECT * FROM production WHERE date>='2021-10-01' AND date<='2023-09-30' 
    # ) a
    # ) b
    # GROUP BY b.custom_year, b.factory_id
    # ORDER BY b.custom_year, b.factory_id;


@pytest.mark.asyncio
async def test_select_dates_range_factories_sum_custom_years_avg( client, assert_against_csv ):
    response = await client.get( f"{urlpath}?time_range=2021-10-01,2023-09-30&factory_aggregation=sum&time_aggregation=year,avg&year_start=10-01" )
    assert response.status_code == 200

    assert_against_csv( f'{csvpath}/select_dates-range_factories-sum_custom-years-avg.csv', response.json() )
    # csv content comes from: 
    # SELECT b.custom_year, ROUND(AVG(b.quantity),2) AS quantity
    # FROM (
    # SELECT
    #     CASE WHEN SUBSTR(a.date,6,5)>='10-01'
    #     THEN SUBSTR(a.date,1,4) || '-' || CAST(SUBSTR(a.date,1,4) AS INTEGER)+1
    #     ELSE CAST(SUBSTR(a.date,1,4) AS INTEGER)-1 || '-' || SUBSTR(a.date,1,4) 
    #     END AS custom_year,
    #     a.quantity
    # FROM ( 
    #     SELECT date, SUM(quantity) AS quantity FROM production 
    #     WHERE date>='2021-10-01' AND date<='2023-09-30'
    #     GROUP BY date
    # ) a
    # ) b
    # GROUP BY b.custom_year
    # ORDER BY b.custom_year;
