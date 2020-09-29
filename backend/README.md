# Fookbace Backend

# Python 3.8.6

# install
pip install -r requirements.txt 

# run
python server.py

# .env
ในไลน์

# jwt token
header = {'Authorization':'token}

# payload register
json({
    account_id,
    first_name,
    last_name,
    pwd,
    birth_date,
    gender
})

# payload login
json({
    account_id,
    pwd
})
