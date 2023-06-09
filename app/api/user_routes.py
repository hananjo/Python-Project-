from flask import Blueprint, jsonify
from flask_login import login_required, current_user
from app.models import User, Cart_Item, db
from app.forms.cart_form import CartForm

user_routes = Blueprint('users', __name__)


@user_routes.route('/')
@login_required
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}


@user_routes.route('/<int:id>')
@login_required
def user(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)
    return user.to_dict()


@user_routes.route('<int:id>/cart')
# @login_required
def cart(id):
    # Get the current user
    # currUser = current_user.to_dict().id

    cartRel_query = Cart_Item.query.filter(Cart_Item.user_id == id)
    # print("**********", products_query)
    cartRels = cartRel_query.all()
    # print('----------', products)
    cartProducts = []
    if (len(cartRels) > 0):
        for rel in cartRels:
            res = rel.to_dict()
            cartProducts.append(res)

    return cartProducts


# This is going to be a button on the product detail page where a user can click and add that product to the cart
@user_routes.route('<int:userId>/cart/<int:prodId>', methods=['POST'])
def addToCart(userId, prodId):
    # currUser = current_user.id

    form = CartForm()

    # print("************", form.quantity.data, form.user_id.data)

    # Creating the cart relationship
    cartRel = Cart_Item(product_id=prodId, user_id=userId, quantity=form.quantity.data)

    # Add the cart relationship to the table
    db.session.add(cartRel)
    db.session.commit()

    # Return success message

    return cartRel.to_dict()
    # Gives us:
        # {
        #     id,
        #     prodId,
        #     userId
        # }

# Edit the quantity of a certain product in the cart
@user_routes.route('<int:userId>/cart/<int:prodId>', methods=['PUT'])
def updateCart(userId, prodId):
    # currUser = current_user.id

    form = CartForm()

    cartRel_query = Cart_Item.query.filter(Cart_Item.user_id == userId, Cart_Item.product_id == prodId)
    cartRel = cartRel_query.one()

    cartRel.quantity = form.quantity.data

    db.session.commit()

    # print("-----------", cartRel.to_dict())

    return cartRel.to_dict()

@user_routes.route('<int:userId>/cart/<int:prodId>', methods=['DELETE'])
def deleteFromCart(userId, prodId):
    # currUser = current_user.id

    cartRel_query = Cart_Item.query.filter(Cart_Item.user_id == userId, Cart_Item.product_id == prodId).one()
    # cartRel = cartRel_query.one()

    test1 = cartRel_query.to_dict() # print(cartRel.to_dict(), "101")
    db.session.delete(cartRel_query)

    db.session.commit()
    # test2 = cartRel.to_dict()
    # print(cartRel.to_dict(), "104")
    return cartRel_query.to_dict()
