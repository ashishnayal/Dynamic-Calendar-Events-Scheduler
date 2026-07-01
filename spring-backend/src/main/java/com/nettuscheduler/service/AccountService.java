package com.nettuscheduler.service;

import com.nettuscheduler.domain.Account;
import com.nettuscheduler.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;

    public Account createAccount(Account account) {
        return accountRepository.save(account);
    }

    public Optional<Account> getAccount(String id) {
        return accountRepository.findById(id);
    }

    public List<Account> getAllAccounts() {
        return accountRepository.findAll();
    }

    public Account updateAccount(String id, Account updatedAccount) {
        return accountRepository.findById(id).map(account -> {
            account.setSettings(updatedAccount.getSettings());
            return accountRepository.save(account);
        }).orElseThrow(() -> new RuntimeException("Account not found"));
    }

    public void deleteAccount(String id) {
        accountRepository.deleteById(id);
    }
}
