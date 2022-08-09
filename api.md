
### Get Plan details 

```
https://databar.ai/api/v2/users/plan-info/

key: X-APIKey

val: r5e8G6yTRE4nmoB3XAjtLN*KYlfaqHdb2zxO9FQUCp+SP-k1

Add to: Header


```

Response 

```
{
    "plan_name": "Free",
    "credits": 49.2,
    "used_storage": 0.411,
    "total_storage": 100,
    "count_of_tables": 3
}
```

### Get All tables 

url: https://databar.ai/api/v2/tables/

```
{
    "count": 3,
    "next": null,
    "previous": null,
    "results": [
        {
            "id": 12023,
            "name": "New table - Coins market related data",
            "dataset_id_based_on": 7,
            "total_cost": 0.1,
            "used_storage": 0.285,
            "created_at": "2022-08-08T11:17:01.258735Z",
            "status": "partially_completed",
            "is_scheduled": false
        },
        {
            "id": 12022,
            "name": "New table - Current crypto asset prices",
            "dataset_id_based_on": 5,
            "total_cost": 0.2,
            "used_storage": 0.083,
            "created_at": "2022-08-08T05:20:29.811758Z",
            "status": "completed",
            "is_scheduled": false
        },
        {
            "id": 12021,
            "name": "New table - Current crypto asset prices",
            "dataset_id_based_on": 5,
            "total_cost": 0.5,
            "used_storage": 0.043,
            "created_at": "2022-08-08T05:10:54.112034Z",
            "status": "partially_completed",
            "is_scheduled": false
        }
    ]
```

### Get Specific Table 

url: https://databar.ai/api/v2/tables/12021


```
{
    "id": 12021,
    "name": "New table - Current crypto asset prices",
    "dataset_id_based_on": 5,
    "total_cost": 0.5,
    "used_storage": 0.043,
    "created_at": "2022-08-08T05:10:54.112034Z",
    "status": "partially_completed",
    "is_scheduled": false
}
```
