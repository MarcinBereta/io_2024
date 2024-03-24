from univariate import numerical, categorical


def get_data(col_csv, col_type, col_name):
    data = []
    graphs = []
    arr_data = csv_to_arr(col_csv)
    if col_type == 'number':
        data = get_num_data(col_csv)
        graphs.append(numerical.histogram_graph(arr_data, col_name))
    elif col_type == 'text':
        graphs.append(categorical.count_graph(arr_data, col_name))
        graphs.append(categorical.count_perc_graph(arr_data, col_name))
    return data, graphs


def csv_to_arr(col_csv):
    column = []
    for pair_val in col_csv:
        if pair_val['value'] is not None:
            column.append(pair_val['value'])
    return column


def get_num_data(col_csv):
    column = csv_to_arr(col_csv)

    result = [
        {
            "name": "Max:",
            "values": numerical.get_max(column)
        },
        {
            "name": "Min:",
            "values": numerical.get_min(column)
        },
        {
            "name": "Mean:",
            "values": numerical.get_mean(column)
        },
        {
            "name": "Median:",
            "values": numerical.get_median(column)
        },
        {
            "name": "Mode:",
            "values": numerical.get_mode(column)
        },
        {
            "name": "Range:",
            "values": numerical.get_range(column)
        },
        {
            "name": "1st quantile:",
            "values": numerical.get_quantile1(column)
        },
        {
            "name": "3rd quantile:",
            "values": numerical.get_quantile3(column)
        },
        {
            "name": "Variance:",
            "values": numerical.get_variance(column)
        },
        {
            "name": "Standard devation:",
            "values": numerical.get_std_dev(column)
        },
        {
            "name": "Coefficient of variation:",
            "values": numerical.get_coef_var(column)
        },
        {
            "name": "Skew:",
            "values": numerical.get_skew(column)
        },
        {
            "name": "Kurtosis:",
            "values": numerical.get_kurtosis(column)
        },
        {
            "name": "Normal distribution:",
            "values": numerical.get_is_normal_distr(column)  # it converts to int in front
        }
    ]
    result = round_num_result(result)
    return result


def round_num_result(arr):
    for pair in arr:
        print(pair["values"])
        pair["values"] = round(pair["values"], 2)
    return arr
