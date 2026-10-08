using NetArchTest.Rules;
using Xunit;

namespace Sahur.ArchitectureTests;

public sealed class ArchitectureRulesTests
{
    [Theory]
    [InlineData("Sahur.Application")]
    [InlineData("Sahur.Infrastructure")]
    [InlineData("Sahur.Api")]
    [InlineData("Microsoft.EntityFrameworkCore")]
    [InlineData("MediatR")]
    [InlineData("Microsoft.AspNetCore")]
    public void Domain_Must_Not_Depend_On_Outer_Layers(string forbiddenNamespace)
    {
        var result = Types
            .InAssembly(typeof(Sahur.Domain.AssemblyReference).Assembly)
            .ShouldNot()
            .HaveDependencyOn(forbiddenNamespace)
            .GetResult();

        Assert.True(result.IsSuccessful);
    }

    [Theory]
    [InlineData("Sahur.Infrastructure")]
    [InlineData("Sahur.Api")]
    [InlineData("Microsoft.EntityFrameworkCore")]
    [InlineData("Microsoft.AspNetCore")]
    public void Application_Must_Not_Depend_On_Outer_Layers(string forbiddenNamespace)
    {
        var result = Types
            .InAssembly(typeof(Sahur.Application.AssemblyReference).Assembly)
            .ShouldNot()
            .HaveDependencyOn(forbiddenNamespace)
            .GetResult();

        Assert.True(result.IsSuccessful);
    }

    [Fact]
    public void Infrastructure_Must_Not_Depend_On_Api()
    {
        var result = Types
            .InAssembly(typeof(Sahur.Infrastructure.DependencyInjection).Assembly)
            .ShouldNot()
            .HaveDependencyOn("Sahur.Api")
            .GetResult();

        Assert.True(result.IsSuccessful);
    }

    [Fact]
    public void Controllers_Must_Not_Depend_On_Infrastructure()
    {
        var result = Types
            .InAssembly(typeof(Sahur.Api.Controllers.SystemController).Assembly)
            .That()
            .ResideInNamespace("Sahur.Api.Controllers")
            .ShouldNot()
            .HaveDependencyOn("Sahur.Infrastructure")
            .GetResult();

        Assert.True(result.IsSuccessful);
    }

    [Fact]
    public void Controllers_Must_Not_Depend_On_EntityFramework()
    {
        var result = Types
            .InAssembly(typeof(Sahur.Api.Controllers.SystemController).Assembly)
            .That()
            .ResideInNamespace("Sahur.Api.Controllers")
            .ShouldNot()
            .HaveDependencyOn("Microsoft.EntityFrameworkCore")
            .GetResult();

        Assert.True(result.IsSuccessful);
    }
}
