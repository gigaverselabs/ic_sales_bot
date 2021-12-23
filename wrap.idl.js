module.exports.IDL = ({ IDL }) => {
    const SubAccount = IDL.Vec(IDL.Nat8);
    const AccountIdentifier__1 = IDL.Text;
    const TokenIndex = IDL.Nat32;
    const Settlement = IDL.Record({
      'subaccount' : SubAccount,
      'seller' : IDL.Principal,
      'buyer' : AccountIdentifier__1,
      'price' : IDL.Nat64,
    });
    const TokenIdentifier__1 = IDL.Text;
    const AccountIdentifier = IDL.Text;
    const User = IDL.Variant({
      'principal' : IDL.Principal,
      'address' : AccountIdentifier,
    });
    const BalanceRequest = IDL.Record({
      'token' : TokenIdentifier__1,
      'user' : User,
    });
    const Balance = IDL.Nat;
    const CommonError__1 = IDL.Variant({
      'InvalidToken' : TokenIdentifier__1,
      'Other' : IDL.Text,
    });
    const BalanceResponse = IDL.Variant({
      'ok' : Balance,
      'err' : CommonError__1,
    });
    const TokenIdentifier = IDL.Text;
    const CommonError = IDL.Variant({
      'InvalidToken' : TokenIdentifier__1,
      'Other' : IDL.Text,
    });
    const Result_5 = IDL.Variant({
      'ok' : AccountIdentifier__1,
      'err' : CommonError,
    });
    const Time = IDL.Int;
    const Listing = IDL.Record({
      'locked' : IDL.Opt(Time),
      'seller' : IDL.Principal,
      'price' : IDL.Nat64,
    });
    const Result_6 = IDL.Variant({
      'ok' : IDL.Tuple(AccountIdentifier__1, IDL.Opt(Listing)),
      'err' : CommonError,
    });
    const Extension = IDL.Text;
    const Metadata = IDL.Variant({
      'fungible' : IDL.Record({
        'decimals' : IDL.Nat8,
        'metadata' : IDL.Opt(IDL.Vec(IDL.Nat8)),
        'name' : IDL.Text,
        'symbol' : IDL.Text,
      }),
      'nonfungible' : IDL.Record({ 'metadata' : IDL.Opt(IDL.Vec(IDL.Nat8)) }),
    });
    const HeaderField = IDL.Tuple(IDL.Text, IDL.Text);
    const HttpRequest = IDL.Record({
      'url' : IDL.Text,
      'method' : IDL.Text,
      'body' : IDL.Vec(IDL.Nat8),
      'headers' : IDL.Vec(HeaderField),
    });
    const HttpResponse = IDL.Record({
      'body' : IDL.Vec(IDL.Nat8),
      'headers' : IDL.Vec(HeaderField),
      'status_code' : IDL.Nat16,
    });
    const ListRequest = IDL.Record({
      'token' : TokenIdentifier,
      'from_subaccount' : IDL.Opt(SubAccount),
      'price' : IDL.Opt(IDL.Nat64),
    });
    const Result_3 = IDL.Variant({ 'ok' : IDL.Null, 'err' : CommonError });
    const Result_4 = IDL.Variant({ 'ok' : Metadata, 'err' : CommonError });
    const Balance__1 = IDL.Nat;
    const Result_2 = IDL.Variant({ 'ok' : Balance__1, 'err' : CommonError });
    const Result_1 = IDL.Variant({
      'ok' : IDL.Vec(TokenIndex),
      'err' : CommonError,
    });
    const Result = IDL.Variant({
      'ok' : IDL.Vec(
        IDL.Tuple(TokenIndex, IDL.Opt(Listing), IDL.Opt(IDL.Vec(IDL.Nat8)))
      ),
      'err' : CommonError,
    });
    const Transaction = IDL.Record({
      'token' : TokenIdentifier,
      'time' : Time,
      'seller' : IDL.Principal,
      'buyer' : AccountIdentifier__1,
      'price' : IDL.Nat64,
    });
    const Memo = IDL.Vec(IDL.Nat8);
    const SubAccount__1 = IDL.Vec(IDL.Nat8);
    const TransferRequest = IDL.Record({
      'to' : User,
      'token' : TokenIdentifier__1,
      'notify' : IDL.Bool,
      'from' : User,
      'memo' : Memo,
      'subaccount' : IDL.Opt(SubAccount__1),
      'amount' : Balance,
    });
    const TransferResponse = IDL.Variant({
      'ok' : Balance,
      'err' : IDL.Variant({
        'CannotNotify' : AccountIdentifier,
        'InsufficientBalance' : IDL.Null,
        'InvalidToken' : TokenIdentifier__1,
        'Rejected' : IDL.Null,
        'Unauthorized' : AccountIdentifier,
        'Other' : IDL.Text,
      }),
    });
    return IDL.Service({
      'TEMPaddPayment' : IDL.Func([IDL.Text, IDL.Principal, SubAccount], [], []),
      'TEMPusedAddresses' : IDL.Func(
          [IDL.Text],
          [IDL.Vec(IDL.Tuple(AccountIdentifier__1, IDL.Principal, SubAccount))],
          [],
        ),
      'acceptCycles' : IDL.Func([], [], []),
      'allPayments' : IDL.Func(
          [],
          [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Vec(SubAccount)))],
          ['query'],
        ),
      'allSettlements' : IDL.Func(
          [],
          [IDL.Vec(IDL.Tuple(TokenIndex, Settlement))],
          ['query'],
        ),
      'availableCycles' : IDL.Func([], [IDL.Nat], ['query']),
      'balance' : IDL.Func([BalanceRequest], [BalanceResponse], ['query']),
      'bearer' : IDL.Func([TokenIdentifier], [Result_5], ['query']),
      'checkOwnership' : IDL.Func([], [IDL.Nat], []),
      'clearPayments' : IDL.Func([IDL.Principal, IDL.Vec(SubAccount)], [], []),
      'delistAll' : IDL.Func([], [IDL.Nat], []),
      'details' : IDL.Func([TokenIdentifier], [Result_6], ['query']),
      'extensions' : IDL.Func([], [IDL.Vec(Extension)], ['query']),
      'getOutstanding' : IDL.Func([], [IDL.Nat], ['query']),
      'getRegistry' : IDL.Func(
          [],
          [IDL.Vec(IDL.Tuple(TokenIndex, AccountIdentifier__1))],
          ['query'],
        ),
      'getTokens' : IDL.Func(
          [],
          [IDL.Vec(IDL.Tuple(TokenIndex, Metadata))],
          ['query'],
        ),
      'http_request' : IDL.Func([HttpRequest], [HttpResponse], ['query']),
      'list' : IDL.Func([ListRequest], [Result_3], []),
      'listings' : IDL.Func(
          [],
          [IDL.Vec(IDL.Tuple(TokenIndex, Listing, Metadata))],
          ['query'],
        ),
      'lock' : IDL.Func(
          [TokenIdentifier, IDL.Nat64, AccountIdentifier__1, SubAccount],
          [Result_5],
          [],
        ),
      'metadata' : IDL.Func([TokenIdentifier], [Result_4], ['query']),
      'mint' : IDL.Func([TokenIdentifier], [IDL.Bool], []),
      'mintOutstanding' : IDL.Func([], [IDL.Nat], []),
      'payments' : IDL.Func([], [IDL.Opt(IDL.Vec(SubAccount))], ['query']),
      'refunds' : IDL.Func([], [IDL.Opt(IDL.Vec(SubAccount))], ['query']),
      'removePayments' : IDL.Func([IDL.Vec(SubAccount)], [], []),
      'removeRefunds' : IDL.Func([IDL.Vec(SubAccount)], [], []),
      'settle' : IDL.Func([TokenIdentifier], [Result_3], []),
      'settlements' : IDL.Func(
          [],
          [IDL.Vec(IDL.Tuple(TokenIndex, AccountIdentifier__1, IDL.Nat64))],
          ['query'],
        ),
      'stats' : IDL.Func(
          [],
          [IDL.Nat64, IDL.Nat64, IDL.Nat64, IDL.Nat64, IDL.Nat, IDL.Nat, IDL.Nat],
          ['query'],
        ),
      'supply' : IDL.Func([TokenIdentifier], [Result_2], ['query']),
      'tokens' : IDL.Func([AccountIdentifier__1], [Result_1], ['query']),
      'tokens_ext' : IDL.Func([AccountIdentifier__1], [Result], ['query']),
      'transactions' : IDL.Func([], [IDL.Vec(Transaction)], ['query']),
      'transfer' : IDL.Func([TransferRequest], [TransferResponse], []),
      'unwrap' : IDL.Func([TokenIdentifier, IDL.Opt(SubAccount)], [IDL.Bool], []),
      'wrap' : IDL.Func([TokenIdentifier], [IDL.Bool], []),
    });
  };
  // export const init = ({ IDL }) => { return []; };