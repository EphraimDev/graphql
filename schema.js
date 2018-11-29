export default `

    type Subscription {
      userAdded: User!
    }

    type Profile {
        profileId: String!
        picture: String!
        packages_bought: String!
        courses_taken: String!
        investment: String!
        address: String!
        state: String!
        city: String!
        zip: Int!
        userId: String!
    }

    type Article {
        articleId: String!
        title: String!
        image: String!
        article: String!
    }

    type User {
        firstname: String!
        lastname: String!
        email: String!
        password: String!
        confirmed: Boolean!
        token: String!
        userId: String!
        profile: [Profile!]!
    }

    type AuthPayload {
      token: String!
      refreshToken: String!
    }

    type Query {
        allUsers: [User!]!
        me: User
        allArticle: [Article!]!
        getArticle(articleId: String!): Article
        getProfile(userId: String!): Profile
    }

    type Mutation {
        register(firstname: String!, lastname: String!, email: String!, password: String!, isAdmin: Boolean): User
        login(email: String!, password: String!): String!
        updateUser(userId: String!): [Int!]!
        deleteUser(userId: String!): Int!
        createProfile(userId: String, picture: String, address: String!, state: String!, city: String!, zip: Int!): Profile
        updateProfile(profileId: String!): [Int!]!
        createArticle(title: String!, image: String!, article: String!): Article!
        createUser(email: String!): User!
        refreshTokens(token: String!, refreshToken: String!): AuthPayload
    }

    schema {
      query: Query
      mutation: Mutation
      subscription: Subscription
    }
`; 
/* import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLSchema,
} from 'graphql';

const ArticleType = new GraphQLObjectType({
  name: 'Article',
  fields: () => ({
    title: { type: GraphQLString },
    image: { type: GraphQLString },
    article: { type: GraphQLString },
    articleId: { type: GraphQLString },
  }),
});

const ProfileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    picture: { type: GraphQLString },
    packages_bought: { type: GraphQLInt },
    courses_taken: { type: GraphQLInt },
    investment: { type: GraphQLInt },
    address: { type: GraphQLString },
    state: { type: GraphQLString },
    city: { type: GraphQLString },
    zip: { type: GraphQLString },
    profileId: { type: GraphQLString },
  }),
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    firstname: { type: GraphQLString },
    lastname: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    confirmed: { type: GraphQLBoolean },
    token: { type: GraphQLString },
    userId: { type: GraphQLString },
    profile: { type: ProfileType },
    article: { type: ArticleType },
  }),
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    allUser: {
      type: UserType,
      resolve(parent, args, {models}) {
        models.Users.findAll()
      }
    },
    getUser: {
      type: UserType,
      resolve(parent, args, {models}) {
        return models.Users.findOne({where: {userId}})
      }
    },
    profile: {
      type: ProfileType,
      resolve(parent, args, {models}) {
        return models.Users.findOne({where: {userId}})
      }
    }
  })
})

const schema = new GraphQLSchema({
  query: RootQuery
})

export default schema; */