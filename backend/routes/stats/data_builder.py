from univariate import numerical, categorical
from bivariate import categorical_categorical, numerical_numerical, numerical_categorical


def get_data(col_csv, col_type, col_name, userId, fileId):
    data = []
    graphs = []
    arr_data = csv_to_arr(col_csv)
    if col_type == 'number':
        data = get_num_data(col_csv)
        graphs.append(numerical.histogram_graph(arr_data, col_name, userId, fileId))
    elif col_type == 'text':
        graphs.append(categorical.count_graph(arr_data, col_name, userId, fileId))
        graphs.append(categorical.count_perc_graph(arr_data, col_name, userId, fileId))
    return data, graphs


def csv_to_arr(col_csv):
    column = []
    for pair_val in col_csv:
        if pair_val['value'] is not None:
            column.append(pair_val['value'])
    return column


def csv2d_to_arr(col1_csv, col2_csv):
    column1 = []
    column2 = []
    for pair1_val, pair2_val in col1_csv, col2_csv:
        if pair1_val['value'] is not None and pair2_val['value'] is not None:
            column1.append(pair1_val['value'])
            column2.append(pair2_val['value'])
    return column1, column2


def get_cat_cat_data(col1_csv, col2_csv):
    column1, column2 = csv2d_to_arr(col1_csv, col2_csv)
    val, p_val, df = categorical_categorical.chi2_test(column1, column2)
    result = [
        {
            "name": "Chi-square value:",
            "values": val
        },
        {
            "name": "df:",
            "values": p_val
        },
        {
            "name": "p:",
            "values": df
        }
    ]
    result = round_num_result(result, 3)
    return result


def get_num_num_data(col1_csv, col2_csv):
    column1, column2 = csv2d_to_arr(col1_csv, col2_csv)
    result = [
        {
            "name": "Correlation:",
            "value": numerical_numerical.correlation(column1, column2)
        },
    ]
    result = round_num_result(result, 2)
    return result


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
    result = round_num_result(result, 2)
    return result


def round_num_result(arr, comma):
    for pair in arr:
        if pair["values"] is not None:
            pair["values"] = round(pair["values"], comma)
    return arr
