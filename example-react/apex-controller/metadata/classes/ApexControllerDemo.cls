global with sharing class ApexControllerDemo {

    public String accountName {get; set;}
    
    public static Account account {get; set;}
    
    public ApexControllerDemo() {}
    
    @RemoteAction
    global static Account getAccount(String accountName) {
        account = [SELECT id, name, phone, type, numberOfEmployees FROM account WHERE name = :accountName];
        return account;
    }
}