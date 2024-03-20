def convert_to_arr(csv):
    columns = len(csv['cols'])
    arr = [[] for _ in range(columns)]
    labels = [None for _ in range(columns)]
    i = 0
    for column in csv['cols']:
        labels[i] = (column['name'], column['type'])
        for value in column['values']:
            arr[i].append(value['value'])
        i += 1
    return arr, labels


example = {'cols': [{'name': 'X', 'type': 'number', 'values': [{'value': 1, 'type': 'normal'}, {'value': 2, 'type': 'normal'}, {'value': 3, 'type': 'normal'}, {'value': None, 'type': 'row_null'}, {'value': 5, 'type': 'normal'}, {'value': 3, 'type': 'normal'}, {'value': 7, 'type': 'normal'}, {'value': 8, 'type': 'normal'}], 'details': [], 'graphs': []},
                {'name': 'Y', 'type': 'number', 'values': [{'value': 2, 'type': 'normal'}, {'value': None, 'type': 'null'}, {'value': None, 'type': 'null'}, {'value': None, 'type': 'row_null'}, {'value': 2, 'type': 'normal'}, {'value': 2, 'type': 'normal'}, {'value': 3, 'type': 'normal'}, {'value': 1, 'type': 'normal'}], 'details': [], 'graphs': []},
                {'name': 'Z', 'type': 'col_null', 'values': [{'value': None, 'type': 'null'}, {'value': None, 'type': 'null'}, {'value': None, 'type': 'null'}, {'value': None, 'type': 'row_null'}, {'value': None, 'type': 'null'}, {'value': None, 'type': 'null'}, {'value': None, 'type': 'null'}, {'value': None, 'type': 'null'}], 'details': [], 'graphs': []}],
       'name': 'baza.csv', 'id:': '2e2a9e85-45eb-47d7-83de-8f95a53f6fff'}
